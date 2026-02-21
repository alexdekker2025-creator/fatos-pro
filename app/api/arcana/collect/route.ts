import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, arcanaNumbers } = body;

    if (!userId || !Array.isArray(arcanaNumbers)) {
      return NextResponse.json(
        { error: 'Invalid request: userId and arcanaNumbers array required' },
        { status: 400 }
      );
    }

    // Validate arcana numbers (1-22)
    const validArcanaNumbers = arcanaNumbers.filter(
      (num) => typeof num === 'number' && num >= 1 && num <= 22
    );

    if (validArcanaNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No valid arcana numbers provided (must be 1-22)' },
        { status: 400 }
      );
    }

    // Collect new unique arcanas
    const newArcanas = [];
    for (const arcanaNumber of validArcanaNumbers) {
      try {
        const arcana = await prisma.collectedArcana.create({
          data: {
            userId,
            arcanaNumber,
          },
        });
        newArcanas.push(arcana);
      } catch (error: any) {
        // Skip if already exists (unique constraint violation)
        if (error.code !== 'P2002') {
          throw error;
        }
      }
    }

    return NextResponse.json({
      success: true,
      newArcanas: newArcanas.length,
      collected: newArcanas.map((a) => a.arcanaNumber),
    });
  } catch (error) {
    console.error('[Arcana Collection Error]', error);
    return NextResponse.json(
      { error: 'Failed to collect arcanas' },
      { status: 500 }
    );
  }
}
