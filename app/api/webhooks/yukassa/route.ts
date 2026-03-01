import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PaymentFactory } from '@/lib/services/payment';
import { upgradeEligibilityService } from '@/lib/services/upgrade/UpgradeEligibilityService';
import { upgradePDFService } from '@/lib/services/upgrade/UpgradePDFService';

export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/yukassa
 * 
 * Обработка вебхуков от ЮKassa
 * 
 * Headers:
 * - Content-Type: application/json
 * 
 * Body: Webhook payload от ЮKassa
 * 
 * Response:
 * - 200 OK: Вебхук успешно обработан
 * - 401 Unauthorized: Неверная подпись вебхука
 * - 400 Bad Request: Некорректные данные
 * - 500 Internal Server Error: Ошибка обработки
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем тело запроса
    const payload = await request.json();

    // Получаем подпись (для ЮKassa это опционально, но проверяем структуру)
    const signature = request.headers.get('X-Signature') || '';

    // Получаем провайдера ЮKassa
    const provider = PaymentFactory.getProvider('RU');

    // Верифицируем вебхук
    if (!provider.verifyWebhook(payload, signature)) {
      console.error('Invalid YuKassa webhook signature', {
        payload: JSON.stringify(payload),
        signature,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid webhook signature',
        },
        { status: 401 }
      );
    }

    // Обрабатываем вебхук
    const result = await provider.processWebhook(payload);

    // Проверяем, существует ли заказ
    const existingOrder = await prisma.order.findUnique({
      where: { id: result.orderId },
    });

    if (!existingOrder) {
      console.error('Order not found for webhook', {
        orderId: result.orderId,
        externalId: result.externalId,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 400 }
      );
    }

    // Проверяем идемпотентность - если заказ уже обработан, возвращаем 200 OK
    if (existingOrder.status !== 'PENDING') {
      console.log('Order already processed (idempotency check)', {
        orderId: result.orderId,
        currentStatus: existingOrder.status,
        newStatus: result.status,
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Order already processed',
        },
        { status: 200 }
      );
    }

    // Обновляем статус заказа
    const updatedOrder = await prisma.order.update({
      where: { id: result.orderId },
      data: {
        status: result.status === 'completed' ? 'COMPLETED' : 'FAILED',
        externalId: result.externalId,
        updatedAt: new Date(),
      },
    });

    // Если платеж успешен, создаем запись Purchase
    if (result.status === 'completed' && existingOrder.serviceId) {
      // Проверяем, является ли это апгрейдом
      const isUpgrade = existingOrder.metadata ? 
        JSON.parse(existingOrder.metadata).isUpgrade === true : 
        false;

      if (isUpgrade) {
        // Обработка апгрейда
        console.log('Processing upgrade order', {
          orderId: existingOrder.id,
          userId: existingOrder.userId,
          serviceId: existingOrder.serviceId,
        });

        // Проверяем eligibility еще раз (idempotency check)
        const eligibilityCheck = await upgradeEligibilityService.checkEligibility(
          existingOrder.userId,
          existingOrder.serviceId
        );

        if (!eligibilityCheck.eligible) {
          console.error('User no longer eligible for upgrade', {
            orderId: existingOrder.id,
            userId: existingOrder.userId,
            serviceId: existingOrder.serviceId,
            reason: eligibilityCheck.reason,
          });

          // Логируем неудачную транзакцию апгрейда
          await prisma.upgradeTransaction.create({
            data: {
              userId: existingOrder.userId,
              orderId: existingOrder.id,
              serviceId: existingOrder.serviceId,
              upgradePrice: Number(existingOrder.amount),
              currency: existingOrder.currency,
              status: 'failed',
              errorMessage: `User no longer eligible: ${eligibilityCheck.reason}`,
            },
          });

          // TODO: Инициировать возврат средств
          console.warn('Refund should be initiated for ineligible upgrade', {
            orderId: existingOrder.id,
          });

          return NextResponse.json(
            {
              success: true,
              message: 'Order processed but user ineligible - refund needed',
            },
            { status: 200 }
          );
        }

        // Создаем Purchase для полного тарифа
        await prisma.purchase.create({
          data: {
            userId: existingOrder.userId,
            serviceId: existingOrder.serviceId,
            orderId: existingOrder.id,
          },
        });

        // Логируем успешную транзакцию апгрейда
        await prisma.upgradeTransaction.create({
          data: {
            userId: existingOrder.userId,
            orderId: existingOrder.id,
            serviceId: existingOrder.serviceId,
            upgradePrice: Number(existingOrder.amount),
            currency: existingOrder.currency,
            status: 'completed',
          },
        });

        // Generate PDF for upgrade (async, don't block webhook response)
        upgradePDFService.generateUpgradePDF(
          existingOrder.userId,
          existingOrder.serviceId
        ).catch((error) => {
          console.error('Failed to generate upgrade PDF:', error);
          // Log error but don't fail the webhook
        });

        console.log('Upgrade purchase created', {
          userId: existingOrder.userId,
          serviceId: existingOrder.serviceId,
          orderId: existingOrder.id,
        });
      } else {
        // Обычная покупка
        await prisma.purchase.create({
          data: {
            userId: existingOrder.userId,
            serviceId: existingOrder.serviceId,
            orderId: existingOrder.id,
          },
        });

        console.log('Purchase created', {
          userId: existingOrder.userId,
          serviceId: existingOrder.serviceId,
          orderId: existingOrder.id,
        });
      }
    }

    console.log('YuKassa webhook processed successfully', {
      orderId: updatedOrder.id,
      status: updatedOrder.status,
      externalId: updatedOrder.externalId,
      amount: updatedOrder.amount,
    });

    // Возвращаем 200 OK
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    // Логируем ошибку
    console.error('YuKassa webhook processing error:', error);

    // Возвращаем 500 для повторной отправки вебхука
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
