'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/Card';

interface ArcanaItem {
  number: number;
  collected: boolean;
  firstSeenAt: string | null;
}

interface ArcanaCollectionData {
  total: number;
  collected: number;
  progress: number;
  arcanas: ArcanaItem[];
}

interface ArcanaCollectionProps {
  userId: string;
}

export default function ArcanaCollection({ userId }: ArcanaCollectionProps) {
  const [data, setData] = useState<ArcanaCollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/arcana/collection?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-purple-300/20 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-purple-300/20 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-4 sm:p-6">
        <p className="text-red-400">Ошибка загрузки коллекции</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Коллекция Арканов
        </h3>
        <p className="text-purple-200 text-sm sm:text-base">
          Собрано: {data.collected} / {data.total}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-purple-900/50 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${data.progress}%` }}
          >
            <div className="h-full w-full animate-pulse-slow bg-white/10"></div>
          </div>
        </div>
        <p className="text-center text-purple-200 mt-2 text-sm">
          {data.progress}% завершено
        </p>
      </div>

      {/* Arcana Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {data.arcanas.map((arcana) => (
          <div
            key={arcana.number}
            className={`
              aspect-square rounded-lg flex items-center justify-center
              text-xs sm:text-sm font-bold transition-all duration-300
              ${
                arcana.collected
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 animate-fade-in'
                  : 'bg-purple-900/30 text-purple-400 border border-purple-700/50'
              }
            `}
            title={
              arcana.collected
                ? `Аркан ${arcana.number} - Собран ${new Date(
                    arcana.firstSeenAt!
                  ).toLocaleDateString()}`
                : `Аркан ${arcana.number} - Не собран`
            }
          >
            {arcana.number}
          </div>
        ))}
      </div>

      {data.collected === data.total && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 animate-fade-in">
          <p className="text-center text-white font-bold text-lg">
            🎉 Поздравляем! Вы собрали все арканы!
          </p>
        </div>
      )}
    </Card>
  );
}
