// Orquestrador do motor de motion. Carregado 1× por sessão via import()
// dinâmico (MotionProvider); montar() roda no load inicial e a cada troca
// de rota — sempre revertendo o mount anterior antes de escanear o DOM novo.
import { gsap, ScrollTrigger } from './gsap';
import { montarAreas } from './areas';

let mm: gsap.MatchMedia | null = null;
let configurado = false;

export function montar(): void {
  desmontar();
  if (!configurado) {
    // barra de URL do mobile recolhendo não é resize de verdade — evita
    // re-layout dos triggers (e jank) a cada colapso
    ScrollTrigger.config({ ignoreMobileResize: true });
    configurado = true;
  }
  mm = gsap.matchMedia();
  montarAreas(mm);
  ScrollTrigger.refresh();
  // fontes trocam métricas de linha (fallback → Newsreader) e mudam a
  // altura do documento DEPOIS do refresh acima — triggers perto do fim
  // da página ficariam com start/end além do scroll alcançável. Se as
  // fontes já chegaram, o then roda imediato e o refresh extra é barato.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  // gancho de QA + CSS: html[data-motion="on"] marca "GSAP assumiu"
  document.documentElement.dataset.motion = 'on';
}

export function desmontar(): void {
  // revert desfaz TUDO que as áreas criaram dentro do mm.add,
  // estilos inline incluídos — o DOM volta ao estado do CSS puro
  mm?.revert();
  mm = null;
  delete document.documentElement.dataset.motion;
}
