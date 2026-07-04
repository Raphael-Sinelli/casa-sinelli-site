import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import LogoPoltrona from '@/components/LogoPoltrona';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
      <LogoPoltrona tamanho={72} className="mx-auto mb-6" />
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-marca mb-3">
        Erro 404
      </p>
      <h1 className="font-serif text-4xl sm:text-5xl font-medium text-grafite leading-tight">
        Essa página saiu de linha
      </h1>
      <p className="mt-5 text-grafite/70 leading-relaxed">
        O endereço que você abriu não existe mais — talvez o produto tenha mudado de lugar no catálogo. Os móveis, esses continuam todos aqui.
      </p>
      <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
        <Link
          href="/catalogo"
          className="inline-flex items-center justify-center gap-2 bg-grafite hover:bg-grafite/85 text-cru font-semibold px-6 py-3.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
        >
          Ver o catálogo
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <a
          href="https://wa.me/5511971776165?text=Ol%C3%A1!%20Estava%20procurando%20um%20produto%20no%20site%20e%20n%C3%A3o%20encontrei.%20Podem%20me%20ajudar%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-wa hover:bg-wa-escuro text-white font-semibold px-6 py-3.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Perguntar à loja
        </a>
      </div>
      <Link
        href="/"
        className="inline-block mt-7 text-sm font-semibold text-musgo hover:underline underline-offset-4"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
