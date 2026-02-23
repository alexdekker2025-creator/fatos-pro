import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import VisitTracker from '@/components/VisitTracker';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <GoogleAnalytics />
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
