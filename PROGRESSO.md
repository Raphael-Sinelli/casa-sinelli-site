# PROGRESSO — Overhaul de design (prompt-design-casa-sinelli-final.md)

**Última sessão:** 2026-07-03
**Fonte da verdade do job:** `prompt-design-casa-sinelli-final.md` (raiz) — trabalho em fases com **portão de aprovação do usuário ao fim de cada fase**.

## ➡️ PRÓXIMA ETAPA: Fase 3 (polimento e piso de qualidade) — a última

Requisitos do prompt para a Fase 3: micro-interações discretas (sem excesso); acessibilidade real (contraste, foco visível, headings, alt text, teclado, `prefers-reduced-motion`); performance com prioridade mobile (LCP, lazy, sem código morto); responsividade impecável de 320 a 1366+; SEO local (title/description, headings semânticos, alt text, termos naturais); copywriting no tom da marca; rodar ui-audit + Playwright + build final. **Entregar o relatório final** com os 10 itens da Seção 9 do prompt (resumo, arquivos, componentes, UI/UX, conversão, SEO, performance, acessibilidade, build, próximos passos).

Fase 2e entregue (commit `cb70313`): footer grafite Portal (categorias derivadas + SEO local discreto), not-found.tsx "Essa página saiu de linha", error.tsx com reset, **status 404 correto** (notFound() no generateMetadata; SEM loading.tsx global — ativa streaming e vira soft-404 em site SSG), Google Maps com embed real (pin confirmado), tokens legados removidos do globals.css (zero usos).

---

## Concluído

| Fase | Entrega | Commit |
|---|---|---|
| 0 — Auditoria | Diagnóstico completo (sem código). Screenshots `audit-*.jpeg` na raiz | — |
| 1 — Design system | 2 direções mockadas; **aprovada: Direção A "Portal" + etiqueta da B** para medidas/specs. Mockups `fase1-direcao-*.jpeg` | — (sem código de produção) |
| 2a — Página de produto + imagens | Galeria abre na variação da capa; seletor tamanho+**cor** (subpastas de 2º nível); lightbox com zoom 2.5×; anterior/próximo na categoria; título antes da galeria no mobile; CTA único; medidas em etiquetas; **next/image ligado** (capa 1,35MB→48KB webp, −97%); horário 9h–19h corrigido + CEP removido do JSON-LD (decisão do usuário) | `7fef48e` |
| 2b — Header | Cru + blur sticky (z-60); selo CS; nav derivada dos dados (top volume + **Colchão garantido** — nome da loja); aria-current sublinhado vinho; menu mobile com as 25 categorias + contagem; CTA "Consultar preço" | `0c7c9b9` |
| 2c — Catálogo/listagem | Card Portal (1 CTA, card clicável, foto em branco puro, badge redundante removida), cabeçalho cru, sidebar/busca retokenizadas, estado vazio com selo CS, SkeletonCard removido | `b3ea6b6` |
| 2d — Home | Hero tese visual (arco + Athenas vinho, LCP eager), 6 categorias com foto, Seleção da loja curada (`DESTAQUE_IDS`), diferenciais lucide, copy honesta, CTA final grafite | `ffd7466` |
| 2e — Footer/404/estados/mapa | Footer grafite Portal, not-found + error na identidade, status 404 correto (sem loading.tsx global — soft-404), mapa com embed real, tokens legados removidos | `cb70313` |

## Falta fazer

- **2e — Footer, 404, estados, mapa**: footer completo na identidade nova (sem emojis); `not-found.tsx` (hoje 404 default do Next em inglês); estados vazio/erro/carregamento pt-BR; **corrigir Google Maps embed** — o atual é placeholder falso (renderiza em branco); usuário já aprovou embed real de Av. Francisco Monteiro 1320, Ribeirão Pires.
- **Fase 3 — Polimento**: micro-interações discretas, acessibilidade (foco, contraste, headings, reduced-motion), performance (LCP mobile, re-render), responsividade 320→1366+, SEO local, copywriting, rodar ui-audit + build final + relatório de entregáveis (Seção 9 do prompt).

## Decisões congeladas / padrões a seguir

- **Tokens** (globals.css `@theme`, amostrados de fotos reais): cru `#F6F2EB` (base), grafite `#332E29` (texto), jatobá `#72533A` (marca), areia `#D8C3A3` (apoio), vinho `#722634` (acento), wa `#25D366` + wa-escuro (SÓ conversão). **Sem ajustes — usuário congelou.**
- **Fontes**: Newsreader (display/serif, `axes:['opsz']`) · Albert Sans (corpo) · Spline Sans Mono (medidas/dados). Playfair/Inter removidas.
- **Assinatura**: arco-portal em molduras de foto (`rounded-t-[72px]`), selo circular "CS" (`rounded-full rounded-bl-sm bg-jatoba`, serif itálico), classe `.etiqueta` (globals.css) para dado técnico.
- **CTA**: rótulo único **"Consultar preço"**, verde wa, ícone `WhatsAppIcon` (componente único — nunca colar o SVG inline). Mensagem: `mensagemWhatsApp()` em lib/produtos.
- **Fotos**: estúdio (fundo branco) → container branco + object-contain; ambientada → object-cover preenchendo. Sempre `next/image` com `sizes` (config: `localPatterns /api/catalogo/**`, `qualities [60,75,85]`, cache 31d).
- **Tokens legados** marrom/oliva ainda existem no globals.css para as páginas antigas — remover na 2e (só Footer.tsx ainda usa).
- Emojis como ícone = proibido (lucide-react já instalado). `ehTamanho`/`rotuloVariacao` normalizam rótulos de variação.
- **Next 16**: ler docs em `node_modules/next/dist/docs/` antes de API nova; `priority` deprecated (usar `preload`/`fetchPriority`); params são Promise.
- **Lição**: `position: sticky` cria stacking context — overlay full-screen dentro de coluna sticky precisa de `createPortal(document.body)` (feito no lightbox).
- Círculo escuro "N" nos screenshots = badge do Next DevTools, só em dev — ignorar.
- Screenshots de fase: `fase<N><letra>-*.jpeg` na raiz (não commitados, não estão no .gitignore).
- Decisões de dados do usuário (2026-07-03): e-mail contato@casasinelli.com.br é real; endereço ok; horário Seg–Sex 9h–19h, Sáb 9h–17h; sem CEP no JSON-LD.
- Memória persistente do agente: `~/.claude/projects/.../memory/project_redesign_overhaul.md` espelha este status.

---

## Arquivo (job anterior concluído — escolha de capas, 2026-07-01)

Capas dos 121→127 produtos escolhidas e gravadas em `produtos.json` (script `scripts/analisar-capas.js`). Notas duráveis: imagens reais ficam em `C:\Imagens\Catalogo\` servidas por `/api/catalogo/[...slug]` (leitura direta do disco, nunca `public/`); nomes tipo `BOA.jpeg`/`COLOCA ESSA.jpeg` indicam seleção manual prévia da loja; fotos WhatsApp exigem checagem visual. Detalhes na história do git deste arquivo.
