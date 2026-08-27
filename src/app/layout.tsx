import type { Metadata, Viewport } from 'next';
import { Newsreader, Albert_Sans, Spline_Sans_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsConsent from '@/components/AnalyticsConsent';
import MotionProvider from '@/lib/motion/MotionProvider';
import { todasCategorias } from '@/lib/catalogo-server';

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
});

const albertSans = Albert_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-albert',
});

const splineSansMono = Spline_Sans_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-spline-mono',
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

export const viewport: Viewport = {
  // barra do navegador na cor de fundo do site (cru)
  themeColor: '#F6F2EB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categorias = todasCategorias();
  // top por volume, com Colchão garantido — é metade do nome da loja
  const porVolume = [...categorias].sort((a, b) => b.total - a.total);
  const categoriasTop = porVolume.slice(0, 4);
  const colchao = categorias.find((c) => c.slug === 'colchao');
  if (colchao && !categoriasTop.some((c) => c.slug === colchao.slug)) {
    categoriasTop.splice(3, 1, colchao);
  }

  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${albertSans.variable} ${splineSansMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-cru text-grafite">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[110] focus:bg-grafite focus:text-cru focus:font-semibold focus:text-sm focus:px-4 focus:py-2.5 focus:rounded-lg"
        >
          Pular para o conteúdo
        </a>
        <Header categoriasTop={categoriasTop} todasCategorias={categorias} />
        <main id="conteudo" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MotionProvider />
        <AnalyticsConsent />
        <CookieConsent />
      </body>
    </html>
  );
}
