/**
 * Компонент для автоматического отслеживания посещений
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Отслеживаем посещение при загрузке страницы
    const trackVisit = async () => {
      try {
        await fetch('/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch (error) {
        // Тихо игнорируем ошибки отслеживания
        console.debug('Visit tracking failed:', error);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // Компонент не рендерит ничего
}
