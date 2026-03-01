import { prisma } from '@/lib/prisma';

/**
 * Service for logging upgrade transactions
 * Provides methods to log initiation, completion, and failure of upgrade operations
 */
export class UpgradeTransactionLogger {
  /**
   * Log upgrade transaction initiation
   * Called when user initiates an upgrade payment
   */
  async logInitiation(data: {
    userId: string;
    orderId: string;
    serviceId: string;
    upgradePrice: number;
    currency: string;
  }): Promise<void> {
    try {
      await prisma.upgradeTransaction.create({
        data: {
          userId: data.userId,
          orderId: data.orderId,
          serviceId: data.serviceId,
          upgradePrice: data.upgradePrice,
          currency: data.currency,
          status: 'initiated',
        },
      });

      console.log('Upgrade transaction initiated', {
        userId: data.userId,
        orderId: data.orderId,
        serviceId: data.serviceId,
      });
    } catch (error) {
      console.error('Failed to log upgrade initiation:', error);
      // Don't throw - logging failure shouldn't block the upgrade flow
    }
  }

  /**
   * Log upgrade transaction completion
   * Called when upgrade payment is successfully processed
   */
  async logCompletion(data: {
    userId: string;
    orderId: string;
    serviceId: string;
    upgradePrice: number;
    currency: string;
  }): Promise<void> {
    try {
      // Check if transaction already exists (from initiation)
      const existing = await prisma.upgradeTransaction.findFirst({
        where: {
          orderId: data.orderId,
        },
      });

      if (existing) {
        // Update existing transaction
        await prisma.upgradeTransaction.update({
          where: { id: existing.id },
          data: {
            status: 'completed',
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new transaction (in case initiation wasn't logged)
        await prisma.upgradeTransaction.create({
          data: {
            userId: data.userId,
            orderId: data.orderId,
            serviceId: data.serviceId,
            upgradePrice: data.upgradePrice,
            currency: data.currency,
            status: 'completed',
          },
        });
      }

      console.log('Upgrade transaction completed', {
        userId: data.userId,
        orderId: data.orderId,
        serviceId: data.serviceId,
      });
    } catch (error) {
      console.error('Failed to log upgrade completion:', error);
      // Don't throw - logging failure shouldn't block the upgrade flow
    }
  }

  /**
   * Log upgrade transaction failure
   * Called when upgrade payment fails or user is ineligible
   */
  async logFailure(data: {
    userId: string;
    orderId: string;
    serviceId: string;
    upgradePrice: number;
    currency: string;
    errorMessage: string;
    stackTrace?: string;
  }): Promise<void> {
    try {
      // Check if transaction already exists
      const existing = await prisma.upgradeTransaction.findFirst({
        where: {
          orderId: data.orderId,
        },
      });

      const errorDetails = data.stackTrace 
        ? `${data.errorMessage}\n\nStack trace:\n${data.stackTrace}`
        : data.errorMessage;

      if (existing) {
        // Update existing transaction
        await prisma.upgradeTransaction.update({
          where: { id: existing.id },
          data: {
            status: 'failed',
            errorMessage: errorDetails,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new transaction
        await prisma.upgradeTransaction.create({
          data: {
            userId: data.userId,
            orderId: data.orderId,
            serviceId: data.serviceId,
            upgradePrice: data.upgradePrice,
            currency: data.currency,
            status: 'failed',
            errorMessage: errorDetails,
          },
        });
      }

      console.error('Upgrade transaction failed', {
        userId: data.userId,
        orderId: data.orderId,
        serviceId: data.serviceId,
        error: data.errorMessage,
      });
    } catch (error) {
      console.error('Failed to log upgrade failure:', error);
      // Don't throw - logging failure shouldn't block error handling
    }
  }

  /**
   * Log refund for upgrade transaction
   * Called when upgrade needs to be refunded (e.g., user no longer eligible)
   */
  async logRefund(data: {
    userId: string;
    orderId: string;
    serviceId: string;
    upgradePrice: number;
    currency: string;
    reason: string;
  }): Promise<void> {
    try {
      // Check if transaction already exists
      const existing = await prisma.upgradeTransaction.findFirst({
        where: {
          orderId: data.orderId,
        },
      });

      if (existing) {
        // Update existing transaction
        await prisma.upgradeTransaction.update({
          where: { id: existing.id },
          data: {
            status: 'refunded',
            errorMessage: `Refund reason: ${data.reason}`,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new transaction
        await prisma.upgradeTransaction.create({
          data: {
            userId: data.userId,
            orderId: data.orderId,
            serviceId: data.serviceId,
            upgradePrice: data.upgradePrice,
            currency: data.currency,
            status: 'refunded',
            errorMessage: `Refund reason: ${data.reason}`,
          },
        });
      }

      console.warn('Upgrade transaction refunded', {
        userId: data.userId,
        orderId: data.orderId,
        serviceId: data.serviceId,
        reason: data.reason,
      });
    } catch (error) {
      console.error('Failed to log upgrade refund:', error);
      // Don't throw - logging failure shouldn't block refund processing
    }
  }

  /**
   * Get all upgrade transactions for a user
   */
  async getUserTransactions(userId: string) {
    return await prisma.upgradeTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get upgrade transaction by order ID
   */
  async getTransactionByOrderId(orderId: string) {
    return await prisma.upgradeTransaction.findFirst({
      where: { orderId },
    });
  }
}

// Export singleton instance
export const upgradeTransactionLogger = new UpgradeTransactionLogger();
