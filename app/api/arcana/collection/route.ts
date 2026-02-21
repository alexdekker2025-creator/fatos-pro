import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      );
    }

    // Get all collected arcanas for user
    const collectedArcanas = await prisma.collectedArcana.findMany({
      where: { userId },
      orderBy: { arcanaNumber: 'asc' },
    });

    // Create array of all 22 arcanas with collection status
    const allArcanas = Array.from({ length: 22 }, (_, i) => {
      const arcanaNumber = i + 1;
      const collected = collectedArcanas.find(
        (a) => a.arcanaNumber === arcanaNumber
      );

      return {
        number: arcanaNumber,
        collected: !!collected,
        firstSeenAt: collected?.firstSeenAt || null,
      };
    });

    return NextResponse.json({
      total: 22,
      collected: collectedArcanas.length,
      progress: Math.round((collectedArcanas.length / 22) * 100),
      arcanas: allArcanas,
    });
  } catch (error) {
    console.error('[Arcana Collection Fetch Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch arcana collection' },
      { status: 500 }
    );
  }
}
