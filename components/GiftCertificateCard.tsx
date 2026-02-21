'use client';

import { useLocale } from 'next-intl';

interface GiftCertificateCardProps {
  recipientName: string;
  senderName: string;
  message?: string;
  activationCode: string;
  reportType: string;
  tier: 'basic' | 'full';
  expiryDate: string;
}

export default function GiftCertificateCard({
  recipientName,
  senderName,
  message,
  activationCode,
  reportType,
  tier,
  expiryDate
}: GiftCertificateCardProps) {
  const locale = useLocale();

  const reportNames: Record<string, { ru: string; en: string }> = {
    destiny_matrix: { ru: 'Матрица судьбы', en: 'Destiny Matrix' },
    child_numerology: { ru: 'Детская нумерология', en: 'Child Numerology' },
    compatibility: { ru: 'Совместимость', en: 'Compatibility' },
    money_numerology: { ru: 'Денежная нумерология', en: 'Money Numerology' },
    yearly_forecast: { ru: 'Годовой прогноз', en: 'Yearly Forecast' },
    pythagorean_full: { ru: 'Квадрат Пифагора', en: 'Pythagorean Square' },
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Certificate Card */}
      <div className="relative bg-gradient-to-br from-[#2D1B4E] via-purple-900 to-indigo-950 rounded-2xl p-8 sm:p-12 shadow-2xl border-4 border-[#FFD700]/50 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)
            `
          }}></div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#FFD700]/70 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#FFD700]/70 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#FFD700]/70 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#FFD700]/70 rounded-br-lg"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Gift Icon */}
          <div className="text-7xl mb-6 animate-float">🎁</div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#FFD700] mb-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
            {locale === 'ru' ? 'Подарочный сертификат' : 'Gift Certificate'}
          </h1>
          <div className="text-purple-300 text-lg mb-8">
            FATOS.pro
          </div>

          {/* Recipient */}
          <div className="mb-8">
            <p className="text-purple-200 text-sm mb-2">
              {locale === 'ru' ? 'Для' : 'For'}
            </p>
            <p className="text-white text-2xl sm:text-3xl font-bold">
              {recipientName}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-8 px-4">
              <div className="glass-strong rounded-lg p-6 border border-purple-400/30">
                <p className="text-purple-200 italic text-sm sm:text-base leading-relaxed">
                  "{message}"
                </p>
                <p className="text-purple-300 text-sm mt-4">
                  — {senderName}
                </p>
              </div>
            </div>
          )}

          {/* Report Details */}
          <div className="mb-8">
            <div className="inline-block glass-strong rounded-lg px-6 py-4 border-2 border-[#FFD700]/50">
              <p className="text-[#FFD700] font-semibold text-lg mb-1">
                {locale === 'ru' 
                  ? reportNames[reportType]?.ru || reportType
                  : reportNames[reportType]?.en || reportType}
              </p>
              <p className="text-purple-300 text-sm">
                {tier === 'full'
                  ? (locale === 'ru' ? 'Полный отчёт' : 'Full Report')
                  : (locale === 'ru' ? 'Базовый отчёт' : 'Basic Report')}
              </p>
            </div>
          </div>

          {/* Activation Code */}
          <div className="mb-8">
            <p className="text-purple-200 text-sm mb-3">
              {locale === 'ru' ? 'Код активации' : 'Activation Code'}
            </p>
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-8 py-4 border-2 border-[#FFD700]">
              <p className="text-[#FFD700] text-2xl sm:text-3xl font-mono font-bold tracking-wider">
                {activationCode}
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="glass rounded-lg p-6 border border-purple-400/20 text-left">
            <h3 className="text-white font-semibold mb-3 text-center">
              {locale === 'ru' ? 'Как активировать' : 'How to Activate'}
            </h3>
            <ol className="space-y-2 text-purple-200 text-sm">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2 font-bold">1.</span>
                <span>
                  {locale === 'ru' 
                    ? 'Перейдите на сайт FATOS.pro'
                    : 'Go to FATOS.pro website'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2 font-bold">2.</span>
                <span>
                  {locale === 'ru'
                    ? 'Зарегистрируйтесь или войдите в аккаунт'
                    : 'Register or log in to your account'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2 font-bold">3.</span>
                <span>
                  {locale === 'ru'
                    ? 'Введите код активации в разделе "Мой профиль"'
                    : 'Enter activation code in "My Profile" section'}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2 font-bold">4.</span>
                <span>
                  {locale === 'ru'
                    ? 'Получите свой персональный отчёт'
                    : 'Get your personal report'}
                </span>
              </li>
            </ol>
          </div>

          {/* Expiry Date */}
          <div className="mt-6 text-purple-300 text-xs">
            {locale === 'ru' ? 'Действителен до' : 'Valid until'}: {expiryDate}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-8 text-[#FFD700]/20 text-6xl transform -translate-y-1/2">
            ✦
          </div>
          <div className="absolute top-1/2 right-8 text-[#FFD700]/20 text-6xl transform -translate-y-1/2">
            ✦
          </div>
        </div>
      </div>

      {/* Download/Print Buttons */}
      <div className="flex gap-4 mt-6 justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 glass-strong rounded-lg border border-purple-400/30 hover:border-[#FFD700]/50 transition-all text-white"
        >
          {locale === 'ru' ? '🖨️ Распечатать' : '🖨️ Print'}
        </button>
        <button
          onClick={() => {
            // TODO: Implement download as image
            alert(locale === 'ru' ? 'Функция в разработке' : 'Feature in development');
          }}
          className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-[#FFD700] text-[#2D1B4E] rounded-lg transition-all font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)]"
        >
          {locale === 'ru' ? '💾 Скачать' : '💾 Download'}
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @media print {
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
