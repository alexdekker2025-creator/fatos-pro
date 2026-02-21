'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Modal } from './ui';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'basic' | 'full';
  onProceedToPayment: (consultationData: ConsultationData) => void;
}

export interface ConsultationData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  preferredDate: string;
  preferredTime: string;
  questions: string;
  communicationMethod: 'zoom' | 'skype' | 'telegram' | 'whatsapp';
}

export default function ConsultationModal({ 
  isOpen, 
  onClose, 
  tier,
  onProceedToPayment 
}: ConsultationModalProps) {
  const locale = useLocale();
  const [formData, setFormData] = useState<ConsultationData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    preferredDate: '',
    preferredTime: '',
    questions: '',
    communicationMethod: 'zoom',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ConsultationData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ConsultationData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = locale === 'ru' ? 'Введите ваше имя' : 'Enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = locale === 'ru' ? 'Введите email' : 'Enter email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'ru' ? 'Неверный формат email' : 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = locale === 'ru' ? 'Введите телефон' : 'Enter phone';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = locale === 'ru' ? 'Укажите дату рождения' : 'Enter birth date';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = locale === 'ru' ? 'Выберите желаемую дату' : 'Select preferred date';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = locale === 'ru' ? 'Выберите время' : 'Select time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onProceedToPayment(formData);
    }
  };

  const handleChange = (field: keyof ConsultationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={locale === 'ru' ? '👤 Запись на консультацию' : '👤 Book Consultation'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Tier Info */}
        <div className="glass rounded-lg p-4 border border-[#FFD700]/30">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[#FFD700] font-semibold text-lg">
                {tier === 'full' 
                  ? (locale === 'ru' ? 'Расширенная консультация' : 'Extended Consultation')
                  : (locale === 'ru' ? 'Базовая консультация' : 'Basic Consultation')}
              </div>
              <div className="text-purple-300 text-sm">
                {tier === 'full'
                  ? (locale === 'ru' ? '90 минут' : '90 minutes')
                  : (locale === 'ru' ? '60 минут' : '60 minutes')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#FFD700]">
                {tier === 'full' ? '12000' : '7000'} ₽
              </div>
              <div className="text-purple-300 text-sm">
                ${tier === 'full' ? '133' : '78'}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Ваше имя' : 'Your Name'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={locale === 'ru' ? 'Анна Иванова' : 'Anna Ivanova'}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.name 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            Email
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="anna@example.com"
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.email 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Телефон' : 'Phone'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.phone 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Дата рождения' : 'Birth Date'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleChange('birthDate', e.target.value)}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              errors.birthDate 
                ? 'border-red-400 focus:ring-red-400' 
                : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
            }`}
          />
          {errors.birthDate && <p className="text-red-400 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        {/* Preferred Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {locale === 'ru' ? 'Желаемая дата' : 'Preferred Date'}
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleChange('preferredDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.preferredDate 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
              }`}
            />
            {errors.preferredDate && <p className="text-red-400 text-sm mt-1">{errors.preferredDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              {locale === 'ru' ? 'Время' : 'Time'}
              <span className="text-red-400 ml-1">*</span>
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => handleChange('preferredTime', e.target.value)}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.preferredTime 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700]'
              }`}
            >
              <option value="" className="bg-[#2D1B4E]">
                {locale === 'ru' ? 'Выберите время' : 'Select time'}
              </option>
              {timeSlots.map(time => (
                <option key={time} value={time} className="bg-[#2D1B4E]">
                  {time}
                </option>
              ))}
            </select>
            {errors.preferredTime && <p className="text-red-400 text-sm mt-1">{errors.preferredTime}</p>}
          </div>
        </div>

        {/* Communication Method */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Способ связи' : 'Communication Method'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'zoom', label: 'Zoom', icon: '💻' },
              { value: 'skype', label: 'Skype', icon: '📞' },
              { value: 'telegram', label: 'Telegram', icon: '✈️' },
              { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
            ].map(method => (
              <button
                key={method.value}
                type="button"
                onClick={() => handleChange('communicationMethod', method.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.communicationMethod === method.value
                    ? 'border-[#FFD700] bg-[#FFD700]/10'
                    : 'border-purple-400/30 hover:border-purple-400/50'
                }`}
              >
                <span className="text-2xl mr-2">{method.icon}</span>
                <span className="text-white">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">
            {locale === 'ru' ? 'Ваши вопросы (необязательно)' : 'Your Questions (Optional)'}
          </label>
          <textarea
            value={formData.questions}
            onChange={(e) => handleChange('questions', e.target.value)}
            placeholder={locale === 'ru' 
              ? 'Опишите, что вас интересует больше всего...'
              : 'Describe what interests you most...'}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 border border-purple-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="glass rounded-lg p-4 border border-purple-400/20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1 text-sm text-purple-200">
              {locale === 'ru' ? (
                <>
                  <p className="mb-2">После оплаты:</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-300">
                    <li>Мы свяжемся с вами для подтверждения времени</li>
                    <li>Вы получите ссылку на видеоконференцию</li>
                    <li>Консультация будет записана и отправлена вам</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="mb-2">After payment:</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-300">
                    <li>We will contact you to confirm the time</li>
                    <li>You will receive a video conference link</li>
                    <li>Consultation will be recorded and sent to you</li>
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
