// Singleton do GSAP — todo módulo de motion importa daqui, nunca de 'gsap'
// direto: garante registerPlugin 1× e um único ponto de configuração.
// Este arquivo só é alcançado pelo import() dinâmico do MotionProvider,
// então gsap + ScrollTrigger ficam num chunk lazy fora do First Load.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Condições nomeadas para gsap.matchMedia — as áreas compõem a partir daqui.
// 640px espelha a media query de mobile do globals.css.
export const MEDIA = {
  desktop: '(min-width: 641px)',
  mobile: '(max-width: 640px)',
  apontadorFino: '(pointer: fine)',
  movimentoOk: '(prefers-reduced-motion: no-preference)',
} as const;

export { gsap, ScrollTrigger };
