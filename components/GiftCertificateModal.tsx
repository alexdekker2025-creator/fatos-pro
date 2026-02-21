'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Modal } from './ui';

interface GiftCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'basic' | 'full';
  onProceedToPayment: (giftData: GiftData) => void;
}

export interface GiftData {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
  reportType: string;
}

const reportTypes = [
  { id: 'destiny_matrix', nameRu: 'Матрица судьбы', nameEn: 'Destiny Matrix' },
  { id: 'child_numerology', nameRu: 'Детская нумерология', nameEn: 'Child Numerology' },
  { id: 'compatibility', nameRu: 'Совместимость', nameEn: 'Compatibility' },
  { id: 'money_numerology', nameRu: 'Денежная нумерология', nameEn: 'Money Numerology' },
  { id: 'yearly_forecast', nameRu: 'Годовой прогноз', nameEn: 'Yearly Forecast' },
  { id: 'pythagorean_full', nameRu: 'Квадрат Пифагора', nameEn: 'Pythagorean Square' },
];

export default function GiftCertificateModal({ 
  isOpen, 
  onClose, 
  tier,
  onProceedToPayment 
}: GiftCertificateModalProps) {
  const locale = useLocale();
  const [formData, setFormData] = useState<GiftData>({
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    message: '',
    reportType: 'destiny_matrix',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GiftData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof GiftData, string>> = {};

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = locale === 'ru' ? 'Введите имя получателя' : 'Enter recipient name';
    }

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = locale === 'ru' ? 'Введите email получателя' : 'Enter recipient email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = locale === 'ru' ? 'Неверный формат email' : 'Invalid email format';
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = locale === 'ru' ? 'Введите ваше имя' : 'Enter your name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onProceedToPayment(formData);
    }
  };

  const handleChange = (field: keyof GiftData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'ru' ? '🎁 Оформление подарочного сертификата' : '🎁 Gift Certificate Details'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Tier Info */}
        <div className="glass rounded-lg p-4 border border-[#FFD700]/30 text-center">
          <div className="text-[#FFD700] font-semibold text-lg mb-1">
            {tier === 'full' 
              ? (locale === 'ru' ? 'Полный отчёт' : 'Full Report')
              : (locale === 'ru' ? 'Базовый отчёт' : 'Basic Report')}
          </div>
          <div className="text-purple-300 text-sm">
            {tier === 'full'
              ? (locale === 'ru' ? '5900 ₽ / $66' : '$66 / 5900 ₽')
              : (locale === 'ru' ? '2900 ₽ / $32' : '$32 / 2900 ₽')}
          </div>
        </div>

        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Тип отчёта' : 'Report Type'}
          </label>
          <select
            value={formData.reportType}
            onChange={(e) => handleChange('reportType', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border border-purple-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all"
          >
            {reportTypes.map(type => (
              <option key={type.id} value={type.id} className="bg-[#2D1B4E] text-white">
                {locale === 'ru' ? type.nameRu : type.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Имя получателя' : 'Recipient Name'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleChange('recipientName', e.target.value)}
            placeholder={locale === 'ru' ? 'Анна' : 'Anna'}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.recipientName 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.recipientName && (
            <p className="text-red-400 text-sm mt-1">{errors.recipientName}</p>
          )}
        </div>

        {/* Recipient Email */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Email получателя' : 'Recipient Email'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => handleChange('recipientEmail', e.target.value)}
            placeholder="anna@example.com"
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.recipientEmail 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.recipientEmail && (
            <p className="text-red-400 text-sm mt-1">{errors.recipientEmail}</p>
          )}
        </div>

        {/* Sender Name */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Ваше имя (от кого)' : 'Your Name (From)'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) => handleChange('senderName', e.target.value)}
            placeholder={locale === 'ru' ? 'Мария' : 'Maria'}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.senderName 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.senderName && (
            <p className="text-red-400 text-sm mt-1">{errors.senderName}</p>
          )}
        </div>

        {/* Personal Message */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Персональное поздравление (необязательно)' : 'Personal Message (Optional)'}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder={locale === 'ru' 
              ? 'Дорогая Анна, поздравляю тебя с днём рождения! Этот отчёт поможет тебе лучше узнать себя...'
              : 'Dear Anna, happy birthday! This report will help you know yourself better...'}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border border-purple-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all resize-none"
          />
          <p className="text-purple-300 text-xs mt-1">
            {locale === 'ru' 
              ? 'Это сообщение будет отображено на открытке'
              : 'This message will be displayed on the card'}
          </p>
        </div>

        {/* Info Box */}
        <div className="glass rounded-lg p-4 border border-purple-400/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1 text-sm text-purple-200">
              {locale === 'ru' ? (
                <>
                  <p className="mb-2">После оплаты получатель получит на email:</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-300">
                    <li>Красивую электронную открытку</li>
                    <li>Уникальный код активации</li>
                    <li>Инструкцию по активации отчёта</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-2">After payment, the recipient will receive via email:</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-300">
                    <li>Beautiful electronic card</li>
                    <li>Unique activation code</li>
                    <li>Report activation instructions</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-purple-400/30 rounded-lg hover:bg-white/10 transition-colors text-white"
          >
            {locale === 'ru' ? 'Отмена' : 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-[#FFD700] text-[#2D1B4E] rounded-lg transition-all font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            {locale === 'ru' ? 'Перейти к оплате' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
