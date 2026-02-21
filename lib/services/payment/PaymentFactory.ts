/**
 * Payment Factory
 * 
 * Фабрика для создания экземпляров платежных провайдеров
 * Реализует паттерн Factory для выбора провайдера на основе региона
 */

import { PaymentProvider, UserRegion, PaymentProviderType } from './types';
import { YuKassaProvider } from './YuKassaProvider';
import { StripeProvider } from './StripeProvider';

/**
 * Фабрика платежных провайдеров
 */
export class PaymentFactory {
  /**
   * Получить провайдера платежной системы на основе региона пользователя
   * 
   * @param region - Регион пользователя ('RU' для России, 'OTHER' для остальных)
   * @returns Экземпляр платежного провайдера
   * @throws Error если провайдер не реализован
   */
  static getProvider(region: UserRegion): PaymentProvider {
    const providerType = this.getProviderType(region);
    
    switch (providerType) {
      case 'yukassa':
        return new YuKassaProvider();
      
      case 'stripe':
        return new StripeProvider();
      
      default:
        throw new Error(`Unknown payment provider: ${providerType}`);
    }
  }

  /**
   * Определить тип провайдера на основе региона
   * 
   * @param region - Регион пользователя
   * @returns Тип платежного провайдера
   */
  static getProviderType(region: UserRegion): PaymentProviderType {
    return region === 'RU' ? 'yukassa' : 'stripe';
  }

  /**
   * Определить регион на основе кода страны (ISO 3166-1 alpha-2)
   * 
   * @param countryCode - Код страны (например, 'RU', 'US', 'GB')
   * @returns Регион пользователя
   */
  static getRegionFromCountryCode(countryCode: string): UserRegion {
    return countryCode.toUpperCase() === 'RU' ? 'RU' : 'OTHER';
  }
}
