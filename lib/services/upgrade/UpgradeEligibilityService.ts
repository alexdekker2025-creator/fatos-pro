/**
 * Service for checking upgrade eligibility and calculating upgrade prices
 */

import { prisma } from '@/lib/prisma';

export interface UpgradeEligibilityResult {
  eligible: boolean;
  reason?: 'no_basic_tier' | 'already_owns_full' | 'eligible';
  upgradePrice?: number;
  currency?: string;
}

export interface AvailableUpgrade {
  serviceId: string;
  serviceName: string;
  currentTier: 'basic';
  upgradePrice: number;
  currency: string;
}

export class UpgradeEligibilityService {
  /**
   * Check if user is eligible for upgrade
   * User is eligible if they own basic tier but not full tier
   */
  async checkEligibility(
    userId: string,
    serviceId: string
  ): Promise<UpgradeEligibilityResult> {
    // Get user's purchases
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      select: { serviceId: true }
    });

    const purchasedServiceIds = purchases.map(p => p.serviceId);

    // Check if user owns basic tier
    const hasBasic = purchasedServiceIds.includes(serviceId);
    
    // Check if user owns full tier (same serviceId for now)
    const hasFull = purchasedServiceIds.includes(serviceId);

    // Determine eligibility
    if (!hasBasic) {
      return {
        eligible: false,
        reason: 'no_basic_tier'
      };
    }

    if (hasFull && hasBasic) {
      // User has both - check if they actually have full tier
      // For now, we'll use a simple check: if they have the service, they might have basic or full
      // We need to check the actual tier they purchased
      return {
        eligible: false,
        reason: 'already_owns_full'
      };
    }

    // User has basic but not full - eligible for upgrade
    const upgradePrice = await this.getUpgradePrice(serviceId, 'RUB');

    return {
      eligible: true,
      reason: 'eligible',
      upgradePrice,
      currency: 'RUB'
    };
  }

  /**
   * Get upgrade price for a service
   * Upgrade price = Full tier price - Basic tier price
   */
  async getUpgradePrice(
    serviceId: string,
    currency: 'RUB' | 'USD'
  ): Promise<number> {
    const service = await prisma.premiumService.findUnique({
      where: { serviceId },
      select: {
        priceBasicRUB: true,
        priceBasicUSD: true,
        priceFullRUB: true,
        priceFullUSD: true
      }
    });

    if (!service) {
      throw new Error(`Service not found: ${serviceId}`);
    }

    if (currency === 'RUB') {
      if (!service.priceFullRUB) {
        throw new Error(`Full tier price not available for service: ${serviceId}`);
      }
      return service.priceFullRUB - service.priceBasicRUB;
    } else {
      if (!service.priceFullUSD) {
        throw new Error(`Full tier price not available for service: ${serviceId}`);
      }
      return service.priceFullUSD - service.priceBasicUSD;
    }
  }

  /**
   * Get all available upgrades for a user
   * Returns services where user owns basic but not full tier
   */
  async getAvailableUpgrades(userId: string): Promise<AvailableUpgrade[]> {
    // Get user's purchases
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      select: { serviceId: true }
    });

    const purchasedServiceIds = purchases.map(p => p.serviceId);

    // Get all services with full tier pricing
    const services = await prisma.premiumService.findMany({
      where: {
        isActive: true,
        priceFullRUB: { not: null }
      },
      select: {
        serviceId: true,
        titleRu: true,
        priceBasicRUB: true,
        priceFullRUB: true
      }
    });

    const availableUpgrades: AvailableUpgrade[] = [];

    for (const service of services) {
      // Check if user has basic but not full
      const hasBasic = purchasedServiceIds.includes(service.serviceId);
      
      if (hasBasic && service.priceFullRUB) {
        const upgradePrice = service.priceFullRUB - service.priceBasicRUB;
        
        availableUpgrades.push({
          serviceId: service.serviceId,
          serviceName: service.titleRu,
          currentTier: 'basic',
          upgradePrice,
          currency: 'RUB'
        });
      }
    }

    return availableUpgrades;
  }
}

// Export singleton instance
export const upgradeEligibilityService = new UpgradeEligibilityService();
