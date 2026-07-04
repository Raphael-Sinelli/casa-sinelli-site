# PROGRESSO — Overhaul de design (prompt-design-casa-sinelli-final.md)

**Última sessão:** 2026-07-03
**Fonte da verdade do job:** `prompt-design-casa-sinelli-final.md` (raiz) — trabalho em fases com **portão de aprovação do usuário ao fim de cada fase**.

## ➡️ PRÓXIMA ETAPA: Fase 2c (catálogo/listagem de categoria)

Requisitos do prompt para a 2c: grid responsivo, cards consistentes, imagem valorizada, nome claro, CTA direto, estado vazio bem feito. Filtros/busca/ordenação **só** se os dados suportarem **e com aprovação prévia**. Ao terminar: build + screenshots antes/depois (desktop e mobile) + commit + **parar e pedir aprovação** antes da 2d.

Pendências da auditoria que a 2c deve resolver:
- Cards com tokens/tipografia novos (hoje ainda marrom/Playfair-era, badge redundante de categoria em página de categoria, dois CTAs competindo por card).
- Foto de estúdio = fundo branco puro; ambientada = preenche moldura (matar "caixa branca dentro do bege").
- Faixa-título marrom da listagem → visual Portal.
- 127 cards renderizados de uma vez no /catalogo — avaliar paginação/chunking.
- Rótulo CTA: "Consultar preço" (nunca outra variação).

---

## Concluído

| Fase | Entrega | Commit |
|---|---|---|
| 0 — Auditoria | Diagnóstico completo (sem código). Screenshots `audit-*.jpeg` na raiz | — |
| 1 — Design system | 2 direções mockadas; **aprovada: Direção A "Portal" + etiqueta da B** para medidas/specs. Mockups `fase1-direcao-*.jpeg` | — (sem código de produção) |
| 2a — Página de produto + imagens | Galeria abre na variação da capa; seletor tamanho+**cor** (subpastas de 2º nível); lightbox com zoom 2.5×; anterior/próximo na categoria; título antes da galeria no mobile; CTA único; medidas em etiquetas; **next/image ligado** (capa 1,35MB→48KB webp, −97%); horário 9h–19h corrigido + CEP removido do JSON-LD (decisão do usuário) | `7fef48e` |
| 2b — Header | Cru + blur sticky (z-60); selo CS; nav derivada dos dados (top volume + **Colchão garantido** — nome da loja); aria-current sublinhado vinho; menu mobile com as 25 categorias + contagem; CTA "Consultar preço" | `0c7c9b9` |

## Falta fazer

- **2c — Catálogo/listagem** ← próxima (ver topo)
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
