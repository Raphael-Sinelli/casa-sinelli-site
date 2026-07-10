// Área: elementos de arco (assinatura SVG da marca) + footer.
// 4 gestos, todos marcados com [data-motion-arco="..."]:
//   recorte  — arco pré-CTA da home "abre" em scrub (interpolação do `d`:
//              curva rasa → cheia conforme a chamada final se aproxima)
//   crest    — contorno do arco do footer se desenha (stroke draw) 1×
//   poltrona — logo assenta dentro do crest logo depois do draw
//   tagline  — máscara de linha: frase sobe por trás do overflow do <p>
//   wordmark — "casa sinelli" monumental sobe em scrub curto no fim da página
// Sem JS/reduced: markup já carrega os estados finais (arco cheio, crest
// desenhado, tudo visível) — aqui só se anima, nunca se esconde via CSS.
import { gsap, ScrollTrigger, MEDIA } from '../gsap';
import { EASE, lerTokens } from '../tokens';
import type { Area } from './index';

// mesma quantidade de comandos do path cheio (markup) — requisito da
// interpolação de atributo do GSAP
const RECORTE_RASO = 'M0,0 H1440 V28 C1080,44 360,44 0,28 Z';
const RECORTE_CHEIO = 'M0,0 H1440 V16 C1080,72 360,72 0,16 Z';

const emCena = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
};

export const arco: Area = (mm) => {
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

      const t = lerTokens();
      const q = (papel: string) =>
        document.querySelector<SVGPathElement & HTMLElement>(`[data-motion-arco="${papel}"]`);

      // 1) Respiração do recorte pré-CTA (só home; scrub = só desktop)
      const recorte = q('recorte');
      if (recorte && c.desktop) {
        gsap.fromTo(
          recorte,
          { attr: { d: RECORTE_RASO } },
          {
            attr: { d: RECORTE_CHEIO },
            ease: 'none',
            scrollTrigger: {
              trigger: recorte.closest('section') ?? recorte,
              start: 'top bottom',
              end: 'top 35%',
              scrub: 0.6,
            },
          }
        );
      }

      // 2) Crest: contorno se desenha 1× quando o footer entra; a poltrona
      //    assenta na sequência. Barato (2 tweens once) — roda no mobile
      //    também. Anti-flash (regra 2.2): footer já em cena no mount
      //    (página curta) fica como está.
      const crest = q('crest');
      const poltrona = q('poltrona');
      if (crest && !emCena(crest)) {
        gsap.set(crest, { strokeDasharray: 1, strokeDashoffset: 1 });
        if (poltrona) gsap.set(poltrona, { autoAlpha: 0, y: 8 });
        ScrollTrigger.create({
          trigger: crest,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(crest, {
              strokeDashoffset: 0,
              duration: t.dur.portal,
              ease: EASE.portal,
              onComplete: () => gsap.set(crest, { clearProps: 'strokeDasharray,strokeDashoffset' }),
            });
            if (poltrona) {
              gsap.to(poltrona, {
                autoAlpha: 1,
                y: 0,
                duration: t.dur.medium,
                ease: EASE.assentar,
                delay: t.dur.portal * 0.45,
                onComplete: () => gsap.set(poltrona, { clearProps: 'all' }),
              });
            }
          },
        });
      }

      // 3) Tagline: máscara de linha (once, todos os breakpoints)
      const tagline = q('tagline');
      if (tagline && !emCena(tagline)) {
        gsap.set(tagline, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: tagline,
          start: 'top 92%',
          once: true,
          onEnter: () =>
            gsap.to(tagline, {
              yPercent: 0,
              duration: t.dur.long,
              ease: EASE.enter,
              onComplete: () => gsap.set(tagline, { clearProps: 'all' }),
            }),
        });
      }

      // 4) Wordmark monumental: rise em scrub curto até o fim da página
      //    (par do parallax do fantasma no hero — mesma regra desktop+fino).
      //    Scrub se auto-posiciona pelo scroll atual: sem risco de flash.
      //    y em px derivado do font-size (yPercent dependeria da altura do
      //    line box, que muda quando a Newsreader substitui o fallback);
      //    end 'max' = exatamente o último pixel rolável — 'bottom bottom'
      //    no último elemento da página fica além do alcançável se o
      //    documento encolher 1px depois do refresh.
      const wordmark = q('wordmark');
      if (wordmark && c.desktop && c.apontadorFino) {
        const subida = parseFloat(getComputedStyle(wordmark).fontSize) * 0.2;
        gsap.fromTo(
          wordmark,
          { y: subida },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: wordmark.parentElement ?? wordmark,
              start: 'top bottom',
              end: 'max',
              scrub: 0.6,
            },
          }
        );
      }
    }
  );
};
