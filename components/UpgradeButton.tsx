'use client';

interface UpgradeButtonProps {
  serviceId: string;
  price: number;
  currency: string;
  locale: 'ru' | 'en';
  onUpgradeClick: () => void;
  disabled?: boolean;
}

export default function UpgradeButton({
  price,
  currency,
  locale,
  onUpgradeClick,
  disabled = false
}: UpgradeButtonProps) {
  const text = locale === 'ru' 
    ? `Доплатить ${price}${currency === 'RUB' ? '₽' : '$'} и получить полный доступ`
    : `Upgrade for ${currency === 'RUB' ? '₽' : '$'}${price} and get full access`;

  return (
    <button
      onClick={onUpgradeClick}
      disabled={disabled}
      className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
    >
      <span className="text-xl">↑</span>
      <span>{text}</span>
    </button>
  );
}
