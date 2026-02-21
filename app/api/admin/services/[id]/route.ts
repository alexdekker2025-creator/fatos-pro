import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - получить одну услугу
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.premiumService.findUnique({
      where: { id: params.id },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

// PUT - обновить услугу
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT /api/admin/services/[id] - ID:', params.id);
    
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
    console.log('Update data:', JSON.stringify(data, null, 2));

    const service = await prisma.premiumService.update({
      where: { id: params.id },
      data: {
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
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });

    console.log('Service updated successfully:', service.id);

    // Логирование действия
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'UPDATE_SERVICE',
        details: { serviceId: service.id },
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error updating service:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Failed to update service', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - удалить услугу
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.premiumService.delete({
      where: { id: params.id },
    });

    // Логирование действия
    await prisma.adminLog.create({
      data: {
        adminId: session.userId,
        action: 'DELETE_SERVICE',
        details: { serviceId: params.id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
