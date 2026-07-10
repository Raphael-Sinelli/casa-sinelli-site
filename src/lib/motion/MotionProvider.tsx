'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type Motor = typeof import('./init');

// Carrega o motor de motion (GSAP) 1× por sessão, fora do caminho crítico:
// só depois do load + idle. Com prefers-reduced-motion o chunk NEM BAIXA
// (0 bytes de custo). A entrada da 1ª dobra continua 100% CSS (globals) —
// o GSAP assume apenas scroll, pointer e coreografias pós-load.
export default function MotionProvider() {
  const pathname = usePathname();
  const motor = useRef<Motor | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    let cancelado = false;
    let idleId: number | undefined;
    let usouIdle = false;

    const carregar = () => {
      if (cancelado || motor.current || mq.matches) return;
      import('./init').then((m) => {
        if (cancelado || mq.matches) return;
        motor.current = m;
        m.montar();
      });
    };
    const agendar = () => {
      if (typeof requestIdleCallback === 'function') {
        usouIdle = true;
        idleId = requestIdleCallback(carregar, { timeout: 4000 });
      } else {
        idleId = window.setTimeout(carregar, 1500);
      }
    };

    // usuário mudou a preferência no meio da sessão: reverte tudo na hora
    // (volta ao site CSS puro); se desligou o reduce, remonta
    const aoMudarPreferencia = () => {
      if (mq.matches) motor.current?.desmontar();
      else if (motor.current) motor.current.montar();
      else carregar();
    };
    mq.addEventListener('change', aoMudarPreferencia);

    if (!mq.matches) {
      if (document.readyState === 'complete') agendar();
      else window.addEventListener('load', agendar, { once: true });
    }

    return () => {
      cancelado = true;
      if (idleId !== undefined) {
        if (usouIdle) cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
      window.removeEventListener('load', agendar);
      mq.removeEventListener('change', aoMudarPreferencia);
      motor.current?.desmontar();
    };
  }, []);

  // troca de rota: o DOM é outro — desmonta os triggers antigos e remonta
  // sobre a página nova (dupla rAF: garante o novo conteúdo pintado)
  useEffect(() => {
    if (!motor.current) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => motor.current?.montar());
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return null;
}
