'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui';

interface CalculationCardProps {
  calculation: {
    id: string;
    birthDate: string;
    calculationType: string;
    results: any;
    createdAt: string;
  };
}

export default function CalculationCard({ calculation }: CalculationCardProps) {
  const t = useTranslations('calculator');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCalculationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pythagorean: t('pythagoreanSquare'),
      destiny: t('destinyNumber'),
      matrix: t('destinyMatrix'),
      all: 'Все расчеты',
    };
    return labels[type] || type;
  };

  return (
    <Card className="p-4 sm:p-6 hover:shadow-2xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            {formatDate(calculation.birthDate)}
          </h3>
          <p className="text-purple-300 text-sm">
            {getCalculationTypeLabel(calculation.calculationType)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-purple-200 text-xs sm:text-sm">
            {formatDateTime(calculation.createdAt)}
          </p>
        </div>
      </div>

      {/* Working Numbers */}
      {calculation.results?.workingNumbers && (
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
            {t('workingNumbers')}
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(calculation.results.workingNumbers).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/5 p-2 rounded text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-white font-bold text-lg sm:text-xl">
                  {value as number}
                </div>
                <div className="text-purple-200 text-xs capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destiny Number */}
      {calculation.results?.destinyNumber && (
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
            {t('destinyNumber')}
          </h4>
          <div className="bg-white/5 p-4 rounded text-center hover:bg-white/10 transition-colors">
            <div className="text-white font-bold text-3xl sm:text-4xl">
              {calculation.results.destinyNumber.value}
            </div>
            {calculation.results.destinyNumber.isMasterNumber && (
              <div className="text-purple-300 text-sm mt-1">Мастер-число</div>
            )}
          </div>
        </div>
      )}

      {/* Pythagorean Square */}
      {calculation.results.pythagoreanSquare && (
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
            {t('pythagoreanSquare')}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {calculation.results.pythagoreanSquare.cells.map((row: number[], rowIndex: number) =>
              row.map((cell: number, colIndex: number) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="bg-white/5 p-3 rounded text-center hover:bg-white/10 transition-colors"
                >
                  <div className="text-white font-bold text-xl sm:text-2xl">
                    {cell}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Destiny Matrix */}
      {calculation.results.destinyMatrix && (
        <div>
          <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">
            {t('destinyMatrix')}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(calculation.results.destinyMatrix.positions).slice(0, 4).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/5 p-2 rounded text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-white font-bold text-lg">{value as number}</div>
                <div className="text-purple-200 text-xs">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
