import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MENSAGENS_WHATSAPP } from '@/lib/whatsapp';
import BotaoWhatsApp from '@/components/BotaoWhatsApp';
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
      <h1 className="font-serif text-4xl sm:text-5xl font-medium text-grafite leading-tight text-balance">
        Essa página saiu de linha
      </h1>
      <p className="mt-5 text-grafite/70 leading-relaxed">
        O endereço que você abriu não existe mais — talvez o produto tenha mudado de lugar no catálogo. Os móveis, esses continuam todos aqui.
      </p>
      <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
        <Link
          href="/catalogo"
          className="inline-flex items-center justify-center gap-2 bg-grafite hover:bg-grafite/85 text-cru font-semibold px-6 py-3.5 rounded-xl transition-[background-color,transform] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
        >
          Ver o catálogo
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <BotaoWhatsApp tamanho="md" mensagem={MENSAGENS_WHATSAPP.naoEncontrei}>
          Perguntar à loja
        </BotaoWhatsApp>
      </div>
      <Link
        href="/"
        className="inline-block mt-7 text-sm font-semibold text-musgo-escuro underline underline-offset-4"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
