// Área: CTAs WhatsApp — hover magnético no FAB e nas pílulas sólidas
// ([data-motion-magnetico]). O botão cede até 6px na direção do cursor e
// volta assentando ao sair — móvel pesado que responde ao toque, não ímã
// de site de agência. Só desktop + pointer fine; touch fica intocado
// (active:scale do CSS continua sendo o feedback de toque).
//
// Sem pulso periódico de propósito (decisão da auditoria): o FAB chama
// atenção ao ENTRAR (fab-assentar, CSS) e depois fica quieto.
import { gsap, MEDIA } from '../gsap';
import { EASE, lerTokens } from '../tokens';
import type { Area } from './index';

const DESLOCAMENTO_MAX = 6; // px — teto do plano da auditoria

export const whatsapp: Area = (mm) => {
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
      if (!c.movimentoOk || !c.desktop || !c.apontadorFino) return;

      const alvos = document.querySelectorAll<HTMLElement>('[data-motion-magnetico]');
      if (!alvos.length) return;

      const t = lerTokens();
      const limpezas: Array<() => void> = [];

      alvos.forEach((el) => {
        const qx = gsap.quickTo(el, 'x', { duration: t.dur.medium, ease: EASE.assentar });
        const qy = gsap.quickTo(el, 'y', { duration: t.dur.medium, ease: EASE.assentar });

        const mover = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          // o rect acompanha o transform atual — desconta o deslocamento
          // aplicado para medir a partir do centro DE REPOUSO (senão o
          // centro foge do cursor e o botão oscila)
          const dx = e.clientX - (r.left + r.width / 2 - Number(gsap.getProperty(el, 'x')));
          const dy = e.clientY - (r.top + r.height / 2 - Number(gsap.getProperty(el, 'y')));
          // proporcional: no centro 0, na borda o teto de 6px
          qx(gsap.utils.clamp(-DESLOCAMENTO_MAX, DESLOCAMENTO_MAX, (dx / (r.width / 2)) * DESLOCAMENTO_MAX));
          qy(gsap.utils.clamp(-DESLOCAMENTO_MAX, DESLOCAMENTO_MAX, (dy / (r.height / 2)) * DESLOCAMENTO_MAX));
        };
        const soltar = () => {
          qx(0);
          qy(0);
        };

        el.addEventListener('pointermove', mover);
        el.addEventListener('pointerleave', soltar);
        limpezas.push(() => {
          el.removeEventListener('pointermove', mover);
          el.removeEventListener('pointerleave', soltar);
        });
      });

      // tweens do quickTo nascem dentro do contexto: o mm.revert() limpa os
      // transforms inline; aqui só os listeners
      return () => {
        for (const limpar of limpezas) limpar();
      };
    }
  );
};
