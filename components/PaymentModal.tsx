'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from './ui';
import { useAuth } from '@/lib/hooks/useAuth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    titleKey: string;
    priceRUB: number;
    priceEUR: number;
  };
  onSuccess: () => void;
  isUpgrade?: boolean;
}

type PaymentProvider = 'yukassa' | 'stripe';

export default function PaymentModal({ isOpen, onClose, service, onSuccess, isUpgrade = false }: PaymentModalProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!selectedProvider) {
      setError(t('premium.selectPaymentMethod'));
      return;
    }

    if (!user) {
      setError(t('premium.loginRequired'));
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Определяем валюту и сумму на основе выбранного провайдера
      const currency = selectedProvider === 'yukassa' ? 'RUB' : 'EUR';
      const amount = selectedProvider === 'yukassa' 
        ? service.priceRUB * 100 // ЮKassa принимает копейки
        : service.priceEUR * 100; // Stripe принимает центы

      // Получаем sessionId из localStorage
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        throw new Error(t('premium.loginRequired'));
      }

      // Создаем платежную сессию
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          countryCode: selectedProvider === 'yukassa' ? 'RU' : 'OTHER',
          serviceId: service.id,
          isUpgrade,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('premium.paymentError'));
      }

      const data = await response.json();

      // Перенаправляем пользователя на страницу оплаты
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(t('premium.noPaymentUrl'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : t('premium.paymentError'));
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('premium.choosePaymentMethod')}>
      <div className="space-y-6">
        {/* Service Info */}
        <div className="glass-strong rounded-lg p-4 border border-purple-400/30">
          <h3 className="font-semibold text-lg mb-2 text-[#FFD700]">{t(service.titleKey)}</h3>
          <div className="flex justify-between items-center">
            <span className="text-purple-200">{t('premium.price')}:</span>
            <div className="text-right">
              <div className="font-bold text-xl text-white">{service.priceRUB} ₽</div>
              <div className="text-sm text-purple-300">{t('premium.or')} {service.priceEUR} EUR</div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {t('premium.selectPaymentMethod')}
          </label>

          {/* ЮKassa Option */}
          <button
            onClick={() => setSelectedProvider('yukassa')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedProvider === 'yukassa'
                ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                : 'border-purple-400/30 hover:border-purple-400/50 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedProvider === 'yukassa'
                    ? 'border-[#FFD700] bg-[#FFD700]'
                    : 'border-purple-400'
                }`}>
                  {selectedProvider === 'yukassa' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#2D1B4E] rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">ЮKassa</div>
                  <div className="text-sm text-purple-300">{t('premium.yukassaDesc')}</div>
                </div>
              </div>
              <div className="font-bold text-lg text-[#FFD700]">{service.priceRUB} ₽</div>
            </div>
          </button>

          {/* Stripe Option */}
          <button
            onClick={() => setSelectedProvider('stripe')}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedProvider === 'stripe'
                ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                : 'border-purple-400/30 hover:border-purple-400/50 bg-white/5'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedProvider === 'stripe'
                    ? 'border-[#FFD700] bg-[#FFD700]'
                    : 'border-purple-400'
                }`}>
                  {selectedProvider === 'stripe' && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#2D1B4E] rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">Stripe</div>
                  <div className="text-sm text-purple-300">{t('premium.stripeDesc')}</div>
                </div>
              </div>
              <div className="font-bold text-lg text-[#FFD700]">{service.priceEUR} EUR</div>
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-6 py-3 border border-purple-400/30 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 text-white"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedProvider || isProcessing}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2D1B4E] to-purple-700 hover:from-purple-700 hover:to-[#2D1B4E] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-[#FFD700]/30 hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
          >
            {isProcessing ? t('premium.processing') : t('premium.proceedToPayment')}
          </button>
        </div>

        {/* Security Note */}
        <div className="text-xs text-purple-300 text-center pt-2">
          🔒 {t('premium.securePayment')}
        </div>
      </div>
    </Modal>
  );
}
