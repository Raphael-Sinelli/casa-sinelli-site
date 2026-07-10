// Registro das áreas de motion (Fase 2). Cada área é uma função que recebe
// o gsap.matchMedia da sessão e registra as próprias animações DENTRO de
// mm.add(...) — assim tudo é revertido em bloco no desmontar (troca de rota,
// reduced-motion ativado no meio da sessão).
//
// Regras de área (contrato):
// - criar animações/ScrollTriggers SÓ dentro de mm.add
// - condicionar com MEDIA.movimentoOk (+ desktop/apontadorFino quando couber)
// - nunca esconder conteúdo via CSS estático para animar depois: o estado
//   inicial é aplicado por gsap.set no momento do mount (sem JS = site atual)
// - só transform/opacity (regra do Assentar); ler valores via lerTokens()

import { hero } from './hero';
import { cards } from './cards';
import { whatsapp } from './whatsapp';
import { arco } from './arco';

export type Area = (mm: gsap.MatchMedia) => void;

// Fase 2 completa: hero ✔ · cards ✔ · menu ✔ (CSS puro, sem área — ver
// globals.css: eventos discretos não esperam o idle-load) · whatsapp ✔ ·
// arco ✔ (transição de rota "portal" segue adiada por decisão do usuário)
const AREAS: Area[] = [hero, cards, whatsapp, arco];

export function montarAreas(mm: gsap.MatchMedia): void {
  for (const area of AREAS) area(mm);
}
