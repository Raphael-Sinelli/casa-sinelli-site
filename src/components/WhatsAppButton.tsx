'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import WhatsAppIcon from './WhatsAppIcon';
import { WHATSAPP_URL } from '@/lib/whatsapp';

// FAB de conversão. Na home ele não disputa com o hero: entra depois de
// ~1 tela de scroll. Nas demais páginas fica sempre visível.
export default function WhatsAppButton() {
  const pathname = usePathname();
  const naHome = pathname === '/';
  const [passouDobra, setPassouDobra] = useState(false);

  useEffect(() => {
    if (!naHome) return;
    const aoRolar = () => setPassouDobra(window.scrollY > window.innerHeight * 0.9);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [naHome]);

  const visivel = !naHome || passouDobra;

  // Duas camadas de motion: o <aside> cuida da entrada/saída (keyframe
  // fab-assentar com overshoot + transition de esconder na home) e o <a>
  // fica com hover/active/magnético — o GSAP escreve transform inline no
  // <a>, que não pode dividir elemento com keyframe de transform.
  return (
    <aside
      aria-label="Atalho de contato"
      aria-hidden={!visivel}
      className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 transition-[opacity,transform] duration-[var(--dur-short)] motion-reduce:transition-none ${
        visivel ? 'opacity-100 translate-y-0 fab-assentar' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar preço pelo WhatsApp"
        tabIndex={visivel ? undefined : -1}
        data-motion-magnetico
        className="flex items-center gap-2 bg-wa hover:bg-wa-escuro text-grafite font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-[background-color,box-shadow,scale] duration-[var(--dur-short)] touch-manipulation hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100 group"
      >
        <WhatsAppIcon className="w-6 h-6 shrink-0" />
        <span className="text-sm hidden sm:inline">Consultar preço</span>
      </a>
    </aside>
  );
}
