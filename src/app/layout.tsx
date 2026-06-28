import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Casa Sinelli — Móveis & Colchões em Ribeirão Pires',
    template: '%s | Casa Sinelli',
  },
  description:
    'Móveis e colchões com qualidade e elegância. Guarda-roupas, sofás, camas, colchões e muito mais. Visite nossa loja em Ribeirão Pires - SP.',
  keywords: ['móveis', 'colchões', 'ribeirão pires', 'casa sinelli', 'guarda-roupa', 'sofá', 'cama'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://casasinelli.com.br',
    siteName: 'Casa Sinelli',
    title: 'Casa Sinelli — Móveis & Colchões',
    description: 'Móveis e colchões com qualidade e elegância em Ribeirão Pires - SP.',
  },
  metadataBase: new URL('https://casasinelli.com.br'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-preto">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
