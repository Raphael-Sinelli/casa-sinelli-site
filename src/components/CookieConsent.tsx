'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { salvarConsentimento, useConsentimento } from '@/lib/cookie-consent';

// Publica a altura real do banner numa custom property para que outros
// elementos fixos (o FAB do WhatsApp) possam abrir espaço e não ficar
// escondidos atrás dele enquanto o aviso está na tela.
const VAR_ALTURA = '--cookie-banner-h';

export default function CookieConsent() {
  const consentimento = useConsentimento();
  const refBanner = useRef<HTMLDivElement>(null);
  const visivel = consentimento === null;

  useEffect(() => {
    if (!visivel) {
      document.documentElement.style.setProperty(VAR_ALTURA, '0px');
      return;
    }

    const elemento = refBanner.current;
    if (!elemento) return;

    const observador = new ResizeObserver(([entrada]) => {
      document.documentElement.style.setProperty(VAR_ALTURA, `${entrada.contentRect.height}px`);
    });
    observador.observe(elemento);

    return () => {
      observador.disconnect();
      document.documentElement.style.setProperty(VAR_ALTURA, '0px');
    };
  }, [visivel]);

  if (!visivel) return null;

  return (
    <div
      ref={refBanner}
      role="region"
      aria-label="Aviso de cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[120] p-3 sm:p-5"
    >
      <div className="max-w-3xl mx-auto bg-grafite text-cru rounded-2xl shadow-xl px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <p className="text-sm text-cru/80 leading-relaxed flex-1">
          Usamos cookies e tecnologias parecidas para melhorar sua experiência no site.
          Você pode aceitar ou recusar os que não são essenciais. Saiba mais na nossa{' '}
          <Link href="/politica-de-privacidade" className="underline underline-offset-4 text-cru">
            política de privacidade
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => salvarConsentimento('recusado')}
            className="inline-flex items-center justify-center border border-cru/30 hover:border-cru/60 text-cru font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-musgo focus-visible:outline-offset-2"
          >
            Recusar
          </button>
          <button
            onClick={() => salvarConsentimento('aceito')}
            className="inline-flex items-center justify-center bg-musgo hover:bg-musgo-escuro text-cru font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-cru focus-visible:outline-offset-2"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
