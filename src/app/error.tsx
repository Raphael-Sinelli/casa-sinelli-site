'use client';

import Link from 'next/link';
import BotaoWhatsApp from '@/components/BotaoWhatsApp';
import LogoPoltrona from '@/components/LogoPoltrona';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
      <LogoPoltrona tamanho={72} className="mx-auto mb-6" />
      <h1 className="font-serif text-4xl sm:text-5xl font-medium text-grafite leading-tight text-balance">
        Algo travou por aqui
      </h1>
      <p className="mt-5 text-grafite/70 leading-relaxed">
        A página encontrou um erro inesperado. Tente recarregar — se continuar, chame a loja no WhatsApp que a gente resolve por lá.
      </p>
      <div className="mt-9 flex flex-col sm:flex-row gap-3.5 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center bg-grafite hover:bg-grafite/85 text-cru font-semibold px-6 py-3.5 rounded-xl transition-[background-color,transform] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
        >
          Tentar de novo
        </button>
        <BotaoWhatsApp tamanho="md">Falar com a loja</BotaoWhatsApp>
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
