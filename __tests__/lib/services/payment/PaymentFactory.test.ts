/**
 * Unit Tests for PaymentFactory
 */

import { PaymentFactory } from '@/lib/services/payment/PaymentFactory';
import { UserRegion, PaymentProviderType } from '@/lib/services/payment/types';

describe('PaymentFactory', () => {
  describe('getProviderType', () => {
    it('должен возвращать yukassa для региона RU', () => {
      const providerType = PaymentFactory.getProviderType('RU');
      expect(providerType).toBe('yukassa');
    });

    it('должен возвращать stripe для региона OTHER', () => {
      const providerType = PaymentFactory.getProviderType('OTHER');
      expect(providerType).toBe('stripe');
    });
  });

  describe('getRegionFromCountryCode', () => {
    it('должен возвращать RU для кода страны RU', () => {
      const region = PaymentFactory.getRegionFromCountryCode('RU');
      expect(region).toBe('RU');
    });

    it('должен возвращать RU для кода страны ru (lowercase)', () => {
      const region = PaymentFactory.getRegionFromCountryCode('ru');
      expect(region).toBe('RU');
    });

    it('должен возвращать OTHER для кода страны US', () => {
      const region = PaymentFactory.getRegionFromCountryCode('US');
      expect(region).toBe('OTHER');
    });

    it('должен возвращать OTHER для кода страны GB', () => {
      const region = PaymentFactory.getRegionFromCountryCode('GB');
      expect(region).toBe('OTHER');
    });

    it('должен возвращать OTHER для кода страны DE', () => {
      const region = PaymentFactory.getRegionFromCountryCode('DE');
      expect(region).toBe('OTHER');
    });

    it('должен возвращать OTHER для любого другого кода страны', () => {
      const region = PaymentFactory.getRegionFromCountryCode('FR');
      expect(region).toBe('OTHER');
    });
  });

  describe('getProvider', () => {
    it('должен возвращать YuKassaProvider для региона RU', () => {
      // Устанавливаем переменные окружения для YuKassa
      process.env.YUKASSA_SHOP_ID = 'test_shop_id';
      process.env.YUKASSA_SECRET_KEY = 'test_secret_key';

      const provider = PaymentFactory.getProvider('RU');
      expect(provider).toBeDefined();
      expect(provider.createSession).toBeDefined();
      expect(provider.verifyWebhook).toBeDefined();
      expect(provider.processWebhook).toBeDefined();

      delete process.env.YUKASSA_SHOP_ID;
      delete process.env.YUKASSA_SECRET_KEY;
    });

    it('должен возвращать StripeProvider для региона OTHER', () => {
      // Устанавливаем переменные окружения для Stripe
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123';

      const provider = PaymentFactory.getProvider('OTHER');
      expect(provider).toBeDefined();
      expect(provider.createSession).toBeDefined();
      expect(provider.verifyWebhook).toBeDefined();
      expect(provider.processWebhook).toBeDefined();

      delete process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });
  });

  describe('Интеграция getRegionFromCountryCode и getProviderType', () => {
    it('должен правильно определять провайдера для RU через код страны', () => {
      const region = PaymentFactory.getRegionFromCountryCode('RU');
      const providerType = PaymentFactory.getProviderType(region);
      expect(providerType).toBe('yukassa');
    });

    it('должен правильно определять провайдера для US через код страны', () => {
      const region = PaymentFactory.getRegionFromCountryCode('US');
      const providerType = PaymentFactory.getProviderType(region);
      expect(providerType).toBe('stripe');
    });

    it('должен правильно определять провайдера для GB через код страны', () => {
      const region = PaymentFactory.getRegionFromCountryCode('GB');
      const providerType = PaymentFactory.getProviderType(region);
      expect(providerType).toBe('stripe');
    });
  });
});
