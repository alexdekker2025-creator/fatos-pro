import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить все услуги
export async function GET(request: NextRequest) {
  try {
    // Проверка авторизации
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const services = await prisma.premiumService.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - создать новую услугу
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const sessionId = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();

    const service = await prisma.premiumService.create({
      data: {
        serviceId: data.serviceId,
        titleRu: data.titleRu,
        titleEn: data.titleEn,
        descriptionRu: data.descriptionRu,
        descriptionEn: data.descriptionEn,
        hookRu: data.hookRu,
        hookEn: data.hookEn,
        priceBasicRUB: data.priceBasicRUB,
        priceBasicUSD: data.priceBasicUSD,
        priceFullRUB: data.priceFullRUB,
        priceFullUSD: data.priceFullUSD,
        icon: data.icon,
        color: data.color,
        featuresBasic: data.featuresBasic,
        featuresFull: data.featuresFull,
        buttonTextRu: data.buttonTextRu,
        buttonTextEn: data.buttonTextEn,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    // Логирование действия
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'CREATE_SERVICE',
        details: { serviceId: service.id },
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
