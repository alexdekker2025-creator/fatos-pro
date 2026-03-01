import { useState, useEffect } from 'react';

export interface UseUpgradeEligibilityReturn {
  isEligible: boolean;
  upgradePrice: number | null;
  loading: boolean;
  error: string | null;
  checkEligibility: (serviceId: string) => Promise<void>;
}

/**
 * Hook for checking upgrade eligibility
 * @param serviceId - Service ID to check eligibility for
 */
export function useUpgradeEligibility(serviceId: string): UseUpgradeEligibilityReturn {
  const [isEligible, setIsEligible] = useState(false);
  const [upgradePrice, setUpgradePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkEligibility = async (sid: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/upgrades/eligibility?serviceId=${sid}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check eligibility');
      }

      if (data.success) {
        setIsEligible(data.eligible);
        setUpgradePrice(data.upgradePrice || null);
      } else {
        setIsEligible(false);
        setUpgradePrice(null);
      }
    } catch (err) {
      console.error('Error checking upgrade eligibility:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsEligible(false);
      setUpgradePrice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      checkEligibility(serviceId);
    }
  }, [serviceId]);

  return {
    isEligible,
    upgradePrice,
    loading,
    error,
    checkEligibility
  };
}
