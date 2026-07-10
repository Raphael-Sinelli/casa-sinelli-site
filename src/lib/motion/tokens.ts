// Tokens do motion system "Assentar/Portal" — fonte única é o globals.css.
// Este módulo só LÊ as CSS vars e converte para as unidades do GSAP
// (segundos, pixels). Valor novo? Entra no globals.css, nunca aqui.

// Mapeamento 1:1 dos cubic-bezier do globals.css para as curvas nativas
// equivalentes do GSAP — os beziers do CSS são as aproximações canônicas
// dessas mesmas curvas (easings.net), então a curva nativa é mais fiel:
export const EASE = {
  /** cubic-bezier(0.25, 1, 0.5, 1) — objeto pesado desacelerando (quart) */
  assentar: 'power3.out',
  /** cubic-bezier(0.16, 1, 0.3, 1) — porta abrindo (expo) */
  portal: 'expo.out',
  /** cubic-bezier(0.22, 1, 0.36, 1) — entradas, cauda longa (quint) */
  enter: 'power4.out',
  /** ≈ cubic-bezier(0.4, 0, 1, 1) — saídas curtas */
  exit: 'power1.in',
  /** ≈ cubic-bezier(0.4, 0, 0.2, 1) — crossfades neutros */
  standard: 'power1.inOut',
} as const;

export interface MotionTokens {
  /** Durações em SEGUNDOS (unidade do GSAP) */
  dur: { micro: number; short: number; medium: number; long: number; portal: number };
  /** Passos de stagger em segundos */
  stagger: { tight: number; standard: number; expressive: number };
  /** Amplitudes de percurso em px (mudam no mobile via media query do CSS) */
  dist: { sm: number; md: number; lg: number };
  scale: { subtle: number; active: number };
}

function numero(bruto: string, fallback: number): number {
  const v = parseFloat(bruto);
  return Number.isFinite(v) ? v : fallback;
}

function segundos(bruto: string, fallbackMs: number): number {
  const limpo = bruto.trim();
  if (limpo.endsWith('ms')) return numero(limpo, fallbackMs) / 1000;
  if (limpo.endsWith('s')) return numero(limpo, fallbackMs / 1000);
  return numero(limpo, fallbackMs) / 1000;
}

/**
 * Snapshot fresco das CSS vars. Chamar DENTRO dos callbacks do
 * gsap.matchMedia: os valores mudam por breakpoint (mobile encurta
 * distâncias e staggers no globals.css) e o matchMedia re-executa
 * o callback na troca — o snapshot acompanha.
 */
export function lerTokens(): MotionTokens {
  const estilo = getComputedStyle(document.documentElement);
  const v = (nome: string) => estilo.getPropertyValue(nome);
  return {
    dur: {
      micro: segundos(v('--dur-micro'), 140),
      short: segundos(v('--dur-short'), 220),
      medium: segundos(v('--dur-medium'), 320),
      long: segundos(v('--dur-long'), 640),
      portal: segundos(v('--dur-portal'), 700),
    },
    stagger: {
      tight: segundos(v('--stagger-tight'), 50),
      standard: segundos(v('--stagger-standard'), 70),
      expressive: segundos(v('--stagger-expressive'), 110),
    },
    dist: {
      sm: numero(v('--motion-distance-sm'), 12),
      md: numero(v('--motion-distance-md'), 24),
      lg: numero(v('--motion-distance-lg'), 40),
    },
    scale: {
      subtle: numero(v('--motion-scale-subtle'), 1.04),
      active: numero(v('--motion-scale-active'), 0.97),
    },
  };
}
