// Área: hero da home — parallax de profundidade do portal.
// Três planos em velocidades distintas enquanto o hero sai de cena:
// fantasma (mais fundo, atrasa mais) > foto-arco > texto (fica no fluxo).
// Entrada do hero continua 100% CSS (globals) — aqui é só scroll.
import { gsap, MEDIA } from '../gsap';
import type { Area } from './index';

export const hero: Area = (mm) => {
  mm.add(
    {
      movimentoOk: MEDIA.movimentoOk,
      desktop: MEDIA.desktop,
      apontadorFino: MEDIA.apontadorFino,
    },
    (ctx) => {
      const c = ctx.conditions as {
        movimentoOk: boolean;
        desktop: boolean;
        apontadorFino: boolean;
      };
      // mobile/tablet (vendedora) e reduced-motion: sem scrub
      if (!c.movimentoOk || !c.desktop || !c.apontadorFino) return;

      const secao = document.querySelector<HTMLElement>('[data-motion-hero="secao"]');
      if (!secao) return; // rota sem hero (catálogo, PDP…)
      const fantasma = secao.querySelector<HTMLElement>('[data-motion-hero="fantasma"]');
      const foto = secao.querySelector<HTMLElement>('[data-motion-hero="foto"]');

      const scrollTrigger = {
        trigger: secao,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      } as const;

      // y positivo = o plano "fica para trás" conforme o scroll leva o hero
      // embora; quanto mais fundo o plano, mais ele atrasa
      if (fantasma) {
        gsap.to(fantasma, { y: 72, ease: 'none', scrollTrigger: { ...scrollTrigger } });
      }
      if (foto) {
        gsap.to(foto, { y: 28, ease: 'none', scrollTrigger: { ...scrollTrigger } });
      }
    }
  );
};
