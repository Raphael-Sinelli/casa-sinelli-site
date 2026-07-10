// Área: grades de cards (catálogo, categoria, home mosaico/Seleção, PDP
// Parecidos) — revelação por ONDA DE LINHA via ScrollTrigger.batch: cards
// que entram na viewport no mesmo intervalo animam juntos com stagger
// (a linha inteira assenta, não item a item). Dentro do card, o carimbo
// mono (categoria/N.º/cores) pousa 60ms depois — ficha sendo carimbada.
// Vitrine 2×1: parallax interno da foto (desliza na folga do padding).
import { gsap, ScrollTrigger, MEDIA } from '../gsap';
import { EASE, lerTokens } from '../tokens';
import type { Area } from './index';

export const cards: Area = (mm) => {
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
      if (!c.movimentoOk) return;

      const grades = Array.from(document.querySelectorAll<HTMLElement>('[data-motion-grade]'));
      if (!grades.length) return;

      const t = lerTokens();
      // mobile (vendedora): percurso menor, onda mais curta e rápida
      const dist = c.desktop ? t.dist.md : t.dist.sm;
      const dur = c.desktop ? t.dur.long * 0.8 : t.dur.medium;
      const passo = c.desktop ? 0.08 : 0.05;

      // Só cards FORA da viewport no momento do mount entram na onda: o GSAP
      // carrega em idle (1–2s pós-load) e esconder o que o usuário já está
      // vendo faria a página piscar. Quem já está em cena fica como está.
      const alvos: HTMLElement[] = [];
      for (const grade of grades) {
        grade.querySelectorAll<HTMLElement>('[data-motion-card]').forEach((el) => {
          const r = el.getBoundingClientRect();
          const emCena = r.top < window.innerHeight && r.bottom > 0;
          if (!emCena) alvos.push(el);
        });
      }

      if (alvos.length) {
        gsap.set(alvos, { autoAlpha: 0, y: dist });
        ScrollTrigger.batch(alvos, {
          start: 'top 92%',
          once: true,
          interval: 0.12, // agrupa a linha que entra junta
          onEnter: (els) => {
            gsap.to(els, {
              autoAlpha: 1,
              y: 0,
              duration: dur,
              ease: EASE.enter,
              stagger: passo,
              overwrite: true,
              // limpa o inline ao terminar: devolve transform/opacity às
              // classes CSS (active:scale dos cards volta a funcionar)
              onComplete: () => gsap.set(els, { clearProps: 'all' }),
            });
            const carimbos = els.flatMap((el) =>
              Array.from((el as HTMLElement).querySelectorAll<HTMLElement>('[data-motion-carimbo]'))
            );
            if (carimbos.length) {
              gsap.fromTo(
                carimbos,
                { autoAlpha: 0, y: -6 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: t.dur.medium,
                  ease: EASE.assentar,
                  stagger: passo,
                  delay: 0.06,
                  overwrite: true,
                  onComplete: () => gsap.set(carimbos, { clearProps: 'all' }),
                }
              );
            }
          },
        });
      }

      // Parallax interno da vitrine: a foto desliza ±10px dentro da folga do
      // padding (p-6/p-8) enquanto o card cruza a viewport. Só desktop com
      // ponteiro fino (mesma regra do parallax do hero).
      if (c.desktop && c.apontadorFino) {
        document.querySelectorAll<HTMLElement>('[data-motion-foto-vitrine]').forEach((foto) => {
          gsap.fromTo(
            foto,
            { y: -10 },
            {
              y: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: foto.closest('[data-motion-card]') ?? foto,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            }
          );
        });
      }

      // Filtro/busca do catálogo muda a altura da grade sem trocar de rota —
      // os triggers precisam de refresh para não disparar cedo/tarde demais
      let timer: number | undefined;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
      });
      for (const grade of grades) ro.observe(grade);

      return () => {
        window.clearTimeout(timer);
        ro.disconnect();
      };
    }
  );
};
