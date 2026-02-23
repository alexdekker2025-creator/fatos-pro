/**
 * Футер сайта с ссылками на контентные страницы
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О проекте */}
          <div>
            <h3 className="text-xl font-bold mb-4">FATOS.pro</h3>
            <p className="text-purple-200 text-sm">
              {t('description')}
            </p>
          </div>

          {/* Ссылки */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/${locale}/about`}
                  className="text-purple-200 hover:text-white transition-colors text-sm"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/faq`}
                  className="text-purple-200 hover:text-white transition-colors text-sm"
                >
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Юридическая информация */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/${locale}/privacy`}
                  className="text-purple-200 hover:text-white transition-colors text-sm"
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/terms`}
                  className="text-purple-200 hover:text-white transition-colors text-sm"
                >
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-purple-700 text-center">
          <p className="text-purple-300 text-sm">
            © {new Date().getFullYear()} FATOS.pro. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
