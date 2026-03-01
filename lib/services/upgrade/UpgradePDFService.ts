import { prisma } from '@/lib/prisma';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';

/**
 * Service for generating PDFs after upgrade purchases
 */
export class UpgradePDFService {
  /**
   * Generate PDF for an upgrade purchase
   * Retrieves calculation data from the user's basic tier purchase
   * and generates a full tier PDF
   */
  async generateUpgradePDF(userId: string, serviceId: string): Promise<void> {
    try {
      // Determine service type (pythagorean or destiny_matrix)
      const serviceType = this.getServiceType(serviceId);
      
      if (serviceType === 'pythagorean') {
        await this.generatePythagoreanUpgradePDF(userId, serviceId);
      } else if (serviceType === 'destiny_matrix') {
        await this.generateDestinyMatrixUpgradePDF(userId, serviceId);
      } else {
        throw new Error(`Unknown service type for serviceId: ${serviceId}`);
      }
    } catch (error) {
      console.error('Error generating upgrade PDF:', error);
      throw error;
    }
  }

  /**
   * Determine service type from serviceId
   */
  private getServiceType(serviceId: string): 'pythagorean' | 'destiny_matrix' | null {
    if (serviceId.startsWith('pythagorean_')) {
      return 'pythagorean';
    } else if (serviceId.startsWith('destiny_matrix_')) {
      return 'destiny_matrix';
    }
    return null;
  }

  /**
   * Generate Pythagorean Square PDF for upgrade
   */
  private async generatePythagoreanUpgradePDF(userId: string, serviceId: string): Promise<void> {
    // Get user's basic tier purchase to retrieve calculation data
    const basicPurchase = await prisma.purchase.findFirst({
      where: {
        userId,
        serviceId: 'pythagorean_basic',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!basicPurchase) {
      throw new Error('Basic tier purchase not found for user');
    }

    // Get user's most recent Pythagorean calculation
    const calculation = await prisma.calculation.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!calculation) {
      throw new Error('No calculation found for user');
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Extract birth date from calculation
    const birthDate = {
      day: calculation.birthDay,
      month: calculation.birthMonth,
      year: calculation.birthYear,
    };

    // Calculate square (in case it's not stored or needs recalculation)
    const calculator = new PythagoreanCalculator();
    const workingNumbers = calculator.calculateWorkingNumbers(birthDate);
    const result = calculator.buildSquare(birthDate, workingNumbers);
    const square = result.cells.flat();

    // Note: PDF generation is handled by the existing endpoint
    // This service just validates that the data is available
    // The actual PDF will be generated when the user requests it via /api/pythagorean/generate-pdf
    
    console.log('Pythagorean upgrade PDF data prepared', {
      userId,
      serviceId,
      birthDate,
      userName: user?.name,
    });
  }

  /**
   * Generate Destiny Matrix PDF for upgrade
   */
  private async generateDestinyMatrixUpgradePDF(userId: string, serviceId: string): Promise<void> {
    // Get user's basic tier purchase to retrieve calculation data
    const basicPurchase = await prisma.purchase.findFirst({
      where: {
        userId,
        serviceId: 'destiny_matrix_basic',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!basicPurchase) {
      throw new Error('Basic tier purchase not found for user');
    }

    // Get user's most recent Destiny Matrix calculation
    const calculation = await prisma.calculation.findFirst({
      where: {
        userId,
        matrix: { not: null },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!calculation) {
      throw new Error('No matrix calculation found for user');
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    console.log('Destiny Matrix upgrade PDF data prepared', {
      userId,
      serviceId,
      userName: user?.name,
    });
  }
}

// Export singleton instance
export const upgradePDFService = new UpgradePDFService();
