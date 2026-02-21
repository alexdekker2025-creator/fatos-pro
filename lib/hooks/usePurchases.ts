import { useState, useEffect } from 'react';

/**
 * Интерфейс покупки
 */
export interface Purchase {
  id: string;
  userId: string;
  serviceId: string;
  orderId: string;
  createdAt: string;
  expiresAt: string | null;
}

/**
 * Хук для работы с покупками пользователя
 * 
 * @returns {Object} Объект с данными о покупках и методами
 */
export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Загрузка покупок пользователя
   */
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);

      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setPurchases([]);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/purchases', {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Сессия истекла
          localStorage.removeItem('sessionId');
          setPurchases([]);
          setLoading(false);
          return;
        }

        throw new Error('Failed to fetch purchases');
      }

      const data = await response.json();
      setPurchases(data.purchases || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Проверка, куплена ли услуга
   * 
   * @param serviceId - ID услуги
   * @returns true, если услуга куплена
   */
  const hasPurchased = (serviceId: string): boolean => {
    return purchases.some((purchase) => purchase.serviceId === serviceId);
  };

  /**
   * Получение покупки по serviceId
   * 
   * @param serviceId - ID услуги
   * @returns Покупка или undefined
   */
  const getPurchase = (serviceId: string): Purchase | undefined => {
    return purchases.find((purchase) => purchase.serviceId === serviceId);
  };

  // Загружаем покупки при монтировании компонента
  useEffect(() => {
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    error,
    hasPurchased,
    getPurchase,
    refetch: fetchPurchases,
  };
}
