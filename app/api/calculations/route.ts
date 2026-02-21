import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/services/auth/AuthService';

const authService = new AuthService();

/**
 * POST /api/calculations
 * 
 * Сохранение результатов расчета
 * 
 * Headers:
 * - Authorization: Bearer <sessionId>
 * 
 * Body:
 * {
 *   birthDate: { day: number, month: number, year: number },
 *   calculationType: "pythagorean" | "destiny" | "matrix" | "all",
 *   results: object
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   calculation: { id, userId, createdAt, ... }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем sessionId из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization header is required',
        },
        { status: 401 }
      );
    }

    const sessionId = authHeader.substring(7); // Убираем "Bearer "

    // Проверяем сессию
    const user = await authService.verifySession(sessionId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired session',
        },
        { status: 401 }
      );
    }

    // Парсим тело запроса
    const body = await request.json();
    const { birthDate, calculationType, results } = body;

    // Валидация данных
    if (!birthDate || !birthDate.day || !birthDate.month || !birthDate.year) {
      return NextResponse.json(
        {
          success: false,
          error: 'Birth date is required',
        },
        { status: 400 }
      );
    }

    if (!calculationType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Calculation type is required',
        },
        { status: 400 }
      );
    }

    if (!results) {
      return NextResponse.json(
        {
          success: false,
          error: 'Results are required',
        },
        { status: 400 }
      );
    }

    // Создаем дату рождения
    const birthDateObj = new Date(
      birthDate.year,
      birthDate.month - 1,
      birthDate.day
    );

    // Сохраняем расчет в базу данных
    const calculation = await prisma.calculation.create({
      data: {
        userId: user.id,
        birthDay: birthDate.day,
        birthMonth: birthDate.month,
        birthYear: birthDate.year,
        workingNumbers: results.workingNumbers || {},
        square: results.square || {},
        destinyNumber: results.destinyNumber || {},
        matrix: results.matrix || null,
      },
    });

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        calculation: {
          id: calculation.id,
          userId: calculation.userId,
          birthDay: calculation.birthDay,
          birthMonth: calculation.birthMonth,
          birthYear: calculation.birthYear,
          workingNumbers: calculation.workingNumbers,
          square: calculation.square,
          destinyNumber: calculation.destinyNumber,
          matrix: calculation.matrix,
          createdAt: calculation.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save calculation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/calculations?limit=10&offset=0
 * 
 * Получение истории расчетов пользователя
 * 
 * Headers:
 * - Authorization: Bearer <sessionId>
 * 
 * Query params:
 * - limit: number (по умолчанию 10)
 * - offset: number (по умолчанию 0)
 * 
 * Response:
 * {
 *   success: true,
 *   calculations: [...],
 *   total: number
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем sessionId из заголовка Authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization header is required',
        },
        { status: 401 }
      );
    }

    const sessionId = authHeader.substring(7);

    // Проверяем сессию
    const user = await authService.verifySession(sessionId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired session',
        },
        { status: 401 }
      );
    }

    // Получаем параметры пагинации
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Получаем расчеты пользователя
    const [calculations, total] = await Promise.all([
      prisma.calculation.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.calculation.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    // Возвращаем успешный ответ
    return NextResponse.json(
      {
        success: true,
        calculations: calculations.map((calc) => ({
          id: calc.id,
          birthDate: calc.birthDate,
          calculationType: calc.calculationType,
          results: calc.results,
          createdAt: calc.createdAt,
        })),
        total,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get calculations error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
