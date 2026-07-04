# PROGRESSO — Overhaul de design (prompt-design-casa-sinelli-final.md)

**Última sessão:** 2026-07-03
**Fonte da verdade do job:** `prompt-design-casa-sinelli-final.md` (raiz) — trabalho em fases com **portão de aprovação do usuário ao fim de cada fase**.

## ➡️ PRÓXIMA ETAPA: Fase 2d (home)

Requisitos do prompt para a 2d: hero como tese visual (abrir com a imagem/ambiente mais forte; sem a grade de fotos a 15% de opacidade), CTA principal WhatsApp + secundário catálogo, blocos de categorias principais (não 25 tiles iguais), produtos em destaque curados (hoje é slice(0,8) do JSON), diferenciais/benefícios sem emoji-ícone, prova de confiança **real** (loja física, entrega/montagem — sem inventar números; "Mais de 127" é falso, são 127 exatos), chamada final. Tokens legados marrom/oliva do globals.css morrem aqui. Ao terminar: build + screenshots antes/depois + commit + **parar e pedir aprovação** antes da 2e.

Fase 2c entregue (commit `b3ea6b6`): card Portal com 1 CTA e card inteiro clicável, badge redundante removida, cabeçalho cru no lugar da faixa marrom, sidebar/busca retokenizadas, estado vazio com selo CS + "Perguntar à loja", SkeletonCard deletado. Decisão registrada: 127 cards continuam renderizando de uma vez (imagens são lazy via next/image; medir na Fase 3 antes de paginar).

---

## Concluído

| Fase | Entrega | Commit |
|---|---|---|
| 0 — Auditoria | Diagnóstico completo (sem código). Screenshots `audit-*.jpeg` na raiz | — |
| 1 — Design system | 2 direções mockadas; **aprovada: Direção A "Portal" + etiqueta da B** para medidas/specs. Mockups `fase1-direcao-*.jpeg` | — (sem código de produção) |
| 2a — Página de produto + imagens | Galeria abre na variação da capa; seletor tamanho+**cor** (subpastas de 2º nível); lightbox com zoom 2.5×; anterior/próximo na categoria; título antes da galeria no mobile; CTA único; medidas em etiquetas; **next/image ligado** (capa 1,35MB→48KB webp, −97%); horário 9h–19h corrigido + CEP removido do JSON-LD (decisão do usuário) | `7fef48e` |
| 2b — Header | Cru + blur sticky (z-60); selo CS; nav derivada dos dados (top volume + **Colchão garantido** — nome da loja); aria-current sublinhado vinho; menu mobile com as 25 categorias + contagem; CTA "Consultar preço" | `0c7c9b9` |
| 2c — Catálogo/listagem | Card Portal (1 CTA, card clicável, foto em branco puro, badge redundante removida), cabeçalho cru, sidebar/busca retokenizadas, estado vazio com selo CS, SkeletonCard removido | `b3ea6b6` |

## Falta fazer

- **2d — Home**: hero como tese visual (imagem forte, sem grade 15% opacity), copy sem clichê IA ("Mais de 127" é falso — são 127 exatos), destaque curado (hoje é slice(0,8) do JSON), bloco de categorias enxuto (25 tiles iguais hoje), diferenciais sem emoji-ícone, prova de confiança real, CTA final. Tokens legados marrom/oliva morrem aqui.
- **2e — Footer, 404, estados, mapa**: footer completo na identidade nova (sem emojis); `not-found.tsx` (hoje 404 default do Next em inglês); estados vazio/erro/carregamento pt-BR; **corrigir Google Maps embed** — o atual é placeholder falso (renderiza em branco); usuário já aprovou embed real de Av. Francisco Monteiro 1320, Ribeirão Pires.
- **Fase 3 — Polimento**: micro-interações discretas, acessibilidade (foco, contraste, headings, reduced-motion), performance (LCP mobile, re-render), responsividade 320→1366+, SEO local, copywriting, rodar ui-audit + build final + relatório de entregáveis (Seção 9 do prompt).

## Decisões congeladas / padrões a seguir

- **Tokens** (globals.css `@theme`, amostrados de fotos reais): cru `#F6F2EB` (base), grafite `#332E29` (texto), jatobá `#72533A` (marca), areia `#D8C3A3` (apoio), vinho `#722634` (acento), wa `#25D366` + wa-escuro (SÓ conversão). **Sem ajustes — usuário congelou.**
- **Fontes**: Newsreader (display/serif, `axes:['opsz']`) · Albert Sans (corpo) · Spline Sans Mono (medidas/dados). Playfair/Inter removidas.
- **Assinatura**: arco-portal em molduras de foto (`rounded-t-[72px]`), selo circular "CS" (`rounded-full rounded-bl-sm bg-jatoba`, serif itálico), classe `.etiqueta` (globals.css) para dado técnico.
- **CTA**: rótulo único **"Consultar preço"**, verde wa, ícone `WhatsAppIcon` (componente único — nunca colar o SVG inline). Mensagem: `mensagemWhatsApp()` em lib/produtos.
- **Fotos**: estúdio (fundo branco) → container branco + object-contain; ambientada → object-cover preenchendo. Sempre `next/image` com `sizes` (config: `localPatterns /api/catalogo/**`, `qualities [60,75,85]`, cache 31d).
- **Tokens legados** marrom/oliva ainda existem no globals.css para as páginas antigas — remover quando 2c/2d/2e re-estilizarem tudo (nada além delas usa).
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
