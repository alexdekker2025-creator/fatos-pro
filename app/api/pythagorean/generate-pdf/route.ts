import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';

export const dynamic = 'force-dynamic';

// Dynamic import for react-pdf (server-side only)
const renderPDF = async (props: any) => {
  const ReactPDF = await import('@react-pdf/renderer');
  const { PythagoreanBasicPDFNew } = await import('@/lib/pdf/PythagoreanBasicPDFNew');
  const React = await import('react');
  const doc = React.createElement(PythagoreanBasicPDFNew, props);
  return await ReactPDF.renderToStream(doc as any);
};

export async function POST(req: NextRequest) {
  try {
    // 1. Check authentication (temporarily disabled for testing)
    const sessionId = req.cookies.get('session')?.value;

    let userId = null;
    let userName = 'Пользователь';

    if (sessionId) {
      const user = await authService.verifySession(sessionId);
      if (user) {
        userId = user.id;
        userName = user.name || 'Пользователь';
      }
    }

    // TODO: Re-enable auth check after testing
    // if (!sessionId || !userId) {
    //   return NextResponse.json(
    //     { error: 'No session found' },
    //     { status: 401 }
    //   );
    // }

    // 2. Get request data
    const { birthDate, tier } = await req.json();
    
    if (!birthDate || !birthDate.day || !birthDate.month || !birthDate.year) {
      return NextResponse.json(
        { error: 'Invalid birth date' },
        { status: 400 }
      );
    }

    // 3. Check purchase (temporarily disabled for testing)
    const serviceId = tier === 'full' ? 'pythagorean_full' : 'pythagorean_basic';
    let purchase = null;
    
    if (userId) {
      purchase = await prisma.purchase.findFirst({
        where: {
          userId: userId,
          serviceId: serviceId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // TODO: Re-enable purchase check after testing
    // if (!purchase) {
    //   return NextResponse.json(
    //     { error: 'Purchase not found. Please buy this service first.' },
    //     { status: 403 }
    //   );
    // }
    
    // Use current date if no purchase found (for testing)
    const purchaseDate = purchase?.createdAt || new Date();

    // 4. Calculate Pythagorean Square
    const calculator = new PythagoreanCalculator();
    const workingNumbers = calculator.calculateWorkingNumbers(birthDate);
    const result = calculator.buildSquare(birthDate, workingNumbers);
    const square = result.cells.flat();

    // 5. Get user name from database if available
    if (userId) {
      const userProfile = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
      if (userProfile?.name) {
        userName = userProfile.name;
      }
    }

    // 6. Generate PDF
    const stream = await renderPDF({
      userName: userName,
      birthDate: {
        day: parseInt(birthDate.day),
        month: parseInt(birthDate.month),
        year: parseInt(birthDate.year),
      },
      square,
      purchaseDate: purchaseDate.toISOString(),
    });

    // 7. Return PDF
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pythagorean-${birthDate.day}-${birthDate.month}-${birthDate.year}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
