# PROGRESSO — Auditoria de front-end (jul/2026)

**Última sessão:** 2026-07-07 (2ª sessão do dia)
**Job atual:** CONCLUÍDO — frente "venda assistida + realce visual" (§0a) commitada e enviada em 2026-07-07, em cima do Bloco B + design/motion (§0/§1) da 1ª sessão. Fora do commit: `prompt-design-casa-sinelli-final.md`, `scripts/mapa-cloudinary-*.json` (não pertencem às frentes) e `.claude/skills/casa-sinelli/SKILL.md` (1 linha removida por edição EXTERNA à sessão — decidir se mantém).

## 0a. Frente venda assistida + realce visual (2026-07-07, 2ª sessão)

Brief do usuário: transformar percepção + servir a vendedora na loja (celular/tablet/balcão). Entregas:

- **PDP**: seção "Parecidos com este" (4 da mesma categoria, ordem circular via `relacionadosDoProduto`, carrossel snap no mobile, stagger); botão **"Enviar este produto"** (`CompartilharProduto`: Web Share nativo → folha do sistema com WhatsApp; fallback desktop copia "nome — link" com aria-live "Link copiado"); etiqueta **"Outras cores e medidas: sob consulta na loja"** só quando `variacoesDisplay<2 && contarCores<2` (nunca inventa variação); `image` no JSON-LD; link "Ver todos em {categoria}" movido da coluna de info para o header da seção (sem duplicar intenção).
- **Cards (`ProductCard`)**: `ProdutoResumo.totalCores` (contagem REAL via `contarCores` em catalogo-utils — 1º nível não-tamanho ou subpastas de 2º nível, rótulo normalizado dedup); linha mono "N cores" quando ≥2; passe-partout interno na foto (`inset-2 ring-grafite/8`); `active:scale-[0.99]` de toque.
- **Hero**: sublinhado caligráfico SVG sob "a sua casa" com draw 620ms após d4 (`.sublinhado-hero`, pathLength=1); passe-partout claro no arco (`inset-3/4 ring-cru/60`); sombra de assentamento (elipse blur sob a foto).
- **Header**: faixa superior da loja física (endereço + horário + WhatsApp, `hidden lg:block`, NÃO sticky — some ao rolar, offsets `top-24` preservados); menu mobile com stagger `.menu-stagger` (4 grupos × 50ms).
- **Footer**: tagline "Móveis que fazem da sua casa a sua casa." em serif itálico.
- Motion novo 100% com `prefers-reduced-motion`; nenhuma lib nova.

Validação: tsc/lint/build verdes (160 rotas SSG); catálogo **34,6 KB gzip** (32 KB antes, meta ±5 KB ok — custo do dado de cores); Playwright em 360/390/768/1440: sem overflow horizontal, wa.me todos com número certo e mensagem com nome do produto, fallback de cópia testado, produto 24 (10 cores) mostra chips e NÃO mostra "sob consulta", produto 80 (sem dado) mostra. Skills de design carregadas nesta sessão: impeccable, frontend-design, design-taste-frontend, web-interface-guidelines, ui-ux-pro-max (+4 do projeto; ui-audit/product-image-quality/casa-sinelli-design/catalog-ux/whatsapp-conversion seguem VAZIAS). Decisões de skill acatadas: sem kickers numerados 01/02/03, sem textura grain global (tells de template).

## 0. Frente design + motion (2026-07-06/07) — CONCLUÍDA, aguardando revisão

Direção aprovada: "Premium acolhedor / Portal" — arco como assinatura semântica (só ambientes: hero, mapa, mosaico), etiqueta de showroom como voz, motion system "Assentar" v2 (tokens `--dur-*`/`--ease-*`/`--stagger-*`/`--motion-*` em globals.css, set mobile próprio, aliases legados). Entregas: hero novo (foto-arco protagonista, sequência-portal 700ms, clamp 84px, dados em etiqueta), mosaico de categorias (âncoras Sofá+Guarda-roupa, cover+gradiente), Seleção (âncora 2 col, scroll-snap mobile, etiqueta real), faixa de diferenciais, recorte curvo pré-CTA, footer lockup tipográfico, header (sublinhado scaleX, hamburger morph), ProductCard (sem linha de preço, acender v2: borda marca+véu areia+scale 1.04, alt="" decorativo), catálogo (sidebar sem card, etiqueta de contagem, destaque 2×1 a cada 14, crossfade 320ms só em categoria, bottom sheet mobile), PDP (entrada 2 tempos; View Transitions CORTADO — experimental no Next 16). Recalibração de intensidade aprovada ao vivo pelo usuário (2026-07-07). A11y: 0 violações axe-core nas 5 páginas (engine trocada: CLI @accesslint com bug CDP; fixes de contraste incluíram tons pré-existentes do footer/breadcrumb — cru/45→70, grafite/60→70). Perf: catálogo 33,7 KB gzip (meta ±5 KB vs 32 KB ✔), CLS≈0, LCP sem atraso do portal, dados fora do bundle. QA: rotas/fluxos/reduced-motion/127 produtos ✔ (screenshots `qa/baseline/` e `qa/depois/`, fora do git). Fix pós-deploy: o arco no mapa cortava o card de endereço do Google (fica dentro do iframe, canto sup. esquerdo) e a faixa-espaçadora que resolvia deixava vazio bege — **decisão final: mapa retangular (`rounded-2xl`), arco reservado a hero/mosaico** (lições: `mx-auto` em grid item encolhe p/ max-content e colapsa iframe a 300px; conteúdo de iframe não escapa de máscara do container). **Commitado junto com o Bloco B em 2026-07-07 (d07f3ec) + fix do mapa em commit seguinte.** Pendência opcional futura: curadoria de 1 foto por categoria no mosaico.

## 1. Status geral

**Bloco B (itens 1–7) IMPLEMENTADO em 2026-07-06 e COMMITADO em 2026-07-07** (commit único junto com a frente design/motion do §0, push feito, `git log origin/main..HEAD` vazio confirmado). Gates typecheck→lint→build verdes em todos os itens; screenshots de trabalho da raiz apagados (QA organizado vive em `qa/`, não versionado).

### Resultado por item (ver §4)

1. **Fundação** — `<BotaoWhatsApp>` único substituiu 10 CTAs duplicados; `lib/produtos.ts` morto, split em `catalogo-server.ts` (server-only) + `catalogo-utils.ts` (puro) + `imagens.ts` (server-only) + `whatsapp.ts` (constantes); `server-only` instalado
2. **Imagens & bundle** — loader custom Cloudinary (`f_auto,q_auto,w_`, otimizador Vercel fora — quota morta); cloudinary-map E produtos.json fora do bundle cliente (0 refs nos chunks); DTO `ProdutoResumo` nas listagens: HTML catálogo 1 MB → 690 KB bruto / **32 KB gzip** (resto é markup duplicado HTML+RSC, estrutural do App Router)
3. **Rendering** — `preload` + `fetchPriority` nas imagens LCP (API nova Next 16, `priority` deprecated confirmado); `React.memo(ProductCard)`; `useDeferredValue(busca)`; `content-visibility:auto` + `contain-intrinsic-size` nos cards; `sizes` por contexto (33vw catálogo, 25vw/50vw home)
4. **Galeria & Lightbox** — `<Lightbox>` extraído com focus trap (verificado), retorno de foco, zoom por teclado (botão + Enter/Espaço, Esc sai do zoom antes de fechar), swipe na galeria mobile (com supressão de clique), crossfade 150ms, entrada fade+scale, hook `useEscapeETravaScroll` (galeria + menu mobile), miniaturas sem `role=listbox` (aria-current)
5. **Navegação & polish** — `?busca=` bidirecional via `history.replaceState` (sem useSearchParams → HTML estático preservado); skip link; SearchBar (name/autocomplete/spellCheck, focus-visible, transition específica); aria-controls; overscroll-contain; themeColor cru; text-balance
6. **Responsivo** — Seleção 1 col ≤420px; chips `pointer-coarse:min-h-11` (44px); FAB com safe-area-inset
7. **Motion** — active:scale-[0.98] nos CTAs; hero escalonado 500ms ease-out-quart 1×; stagger 40ms na Seleção (IntersectionObserver + fallback `scripting:none`); FAB só após ~1 tela na home; tudo com prefers-reduced-motion

### Extras surgidos na verificação

- **Busca sem acento** (fix dentro do item 5): "sofa" não achava "Sofá" — `buscarProdutos` agora normaliza NFD dos dois lados (pré-existente, descoberto ao testar `?busca=sofa` → 0 resultados)
- Warning cosmético: preload w_384 "not used" no console do produto (mismatch de timing do preload scan, sem erro funcional)
- Decisão menor embutida: padding dos CTAs do footer/estado-vazio normalizado para o tamanho `sm` do componente (±2px) — apontar na revisão

## 1b. Pendências para a próxima sessão

1. ~~Commit único + push~~ **feito 2026-07-07**; ~~apagar screenshots da raiz~~ **feito**
2. Baixa prioridade (pré-existentes): skills `.claude/skills/*` vazias; warning Turbopack do readFile (silenciável com `outputFileTracingExcludes`); curadoria opcional de foto por categoria no mosaico (§0)

## 2. Decisões travadas (não perguntar de novo)

### Da fase de diagnóstico (todas implementadas no Bloco B)

- Contraste WhatsApp: texto grafite (`#332E29`) sobre o verde atual — **implementado**
- Imagens: **Cloudinary loader custom** (`f_auto,q_auto,w_`) em vez do otimizador Vercel — **implementado** (`src/lib/cloudinary-loader.ts` + `next.config.ts`)
- Animação: pacote **"Micro + assinatura"** (micro-interações + 1 entrada assinatura no hero da home, stagger sutil na grade "Seleção da loja", tudo com `prefers-reduced-motion`) — **implementado**
- Galeria: **swipe mobile habilitado** — **implementado**
- FAB WhatsApp: **oculto na primeira dobra da home**, aparece após ~1 tela (demais páginas: sempre visível) — **implementado**
- Paleta de cores da marca: **NUNCA alterar** — base é o logo Casa Sinelli (cru, grafite, marca, areia, musgo). Tokens novos derivados já aprovados: `musgo-escuro #5D7247` (texto pequeno AA) e `wa-escuro` recalibrado `#20B85A` (hover AA com texto grafite)

### Nascidas no Bloco B (padrões de código a seguir daqui em diante)

- **Arquitetura `src/lib/`** (substituiu `lib/produtos.ts`, que não existe mais):
  - `catalogo-server.ts` — dados de produtos.json, `import 'server-only'` (build quebra se client importar)
  - `catalogo-utils.ts` — funções puras, único módulo do catálogo permitido em client components
  - `imagens.ts` — resolução de URL (cloudinary-map), `server-only`; client recebe URL pronta (`ProdutoResumo.capaUrl`, `mapaUrlsProduto`)
  - `whatsapp.ts` — número, telefone formatado, `linkWhatsApp()`, `mensagemProduto()`, `MENSAGENS_WHATSAPP` (único lugar com o número)
- **CTA WhatsApp**: sempre `<BotaoWhatsApp>` (tamanhos `sm/md/lg/xl`, `fundoEscuro`, `larguraTotal`, `mensagem`) — **nunca** colar `<a>` verde inline de novo. FAB continua componente próprio (`WhatsAppButton`)
- **Listagens** (catálogo/categoria/Seleção): client recebe `ProdutoResumo` (id, nome, categoria, capaUrl) — nunca `Produto` completo
- **URL state em rota SSG**: `history.replaceState` + leitura de `window.location` no mount — **nunca `useSearchParams`** (derruba o HTML estático via bailout CSR)
- **Busca**: normalização NFD sem acento nos dois lados (`buscarProdutos`) — "sofa" encontra "Sofá"
- **LCP**: `preload` + `fetchPriority="high"` (API Next 16; `priority` e `loading="eager"` não se usam mais)
- Normalização aceita: CTAs do footer e do estado vazio do catálogo assumiram o tamanho `sm` do componente (±2px de padding vs. original)

## 3. Achados consolidados das auditorias (resumo) — TODOS RESOLVIDOS no Bloco B

- **Acessibilidade:** 186→0 violações (engine @accesslint/core, 5 páginas) — no working tree
- **Web Interface Guidelines:** focus trap/retorno de foco no lightbox ✔ · URL state `?busca=` ✔ · skip link ✔ · `role=listbox` removido ✔
- **Performance:** cloudinary-map fora do bundle ✔ (e produtos.json junto) · HTML catálogo 1 MB → 690 KB / 32 KB gzip ✔ · quota Vercel eliminada (loader custom) ✔
- **Composition patterns:** botão WhatsApp unificado ✔ · `lib/produtos.ts` extinto (split server/utils) ✔

## 4. Tabela de implementação aprovada (Bloco B)

| # | Item | Conteúdo | Status |
|---|------|----------|--------|
| 1 | Fundação | `<BotaoWhatsApp>` único (mata 11 duplicações) · split `lib/` em `catalogo-server.ts` (`server-only`) + `catalogo-utils.ts` puro · constantes WhatsApp centralizadas | **feito** |
| 2 | Imagens & bundle | Loader custom Cloudinary (`f_auto,q_auto,w_`) · `cloudinary-map` sai do cliente (−234 KB JS) · DTO enxuto no catálogo (1 MB → 690 KB / 32 KB gzip) | **feito** |
| 3 | Rendering | Preload das imagens LCP via `preload`+`fetchPriority` (API Next 16 conferida nos types) · `React.memo(ProductCard)` + `useDeferredValue(busca)` · `content-visibility: auto` nos cards · `sizes` por contexto | **feito** |
| 4 | Galeria & Lightbox | Extração `<Lightbox>` · focus trap + retorno de foco · zoom por teclado · remove `role=listbox` das miniaturas · hook `useEscapeETravaScroll` · crossfade 150ms na troca de foto · entrada fade+scale do lightbox · swipe na galeria mobile | **feito** |
| 5 | Navegação & polish | URL state no catálogo (`?busca=`) · skip link · SearchBar (`transition-all`→específico, `focus-visible:`, `name`/`autocomplete`/`spellCheck`) · `aria-controls` no filtro mobile · `overscroll-contain` (menu + lightbox) · `themeColor` cru · `text-balance` em headings · fix busca sem acento | **feito** |
| 6 | Responsivo fino | Grade "Seleção" 1 col até 420px · touch targets ≥44px nos chips (`pointer-coarse:`) · FAB com `safe-area-inset` | **feito** |
| 7 | Motion pack | `active:scale-[0.98]` nos CTAs · hero da home: entrada fade/rise escalonada 1× (500ms, ease-out-quart) · stagger 40ms só na grade "Seleção da loja" · FAB aparece após 1 tela na home · tudo com `prefers-reduced-motion` | **feito** |

## 5. Regras de processo

- ~~Executar itens 1→7 em sequência~~ **feito** (gates typecheck→lint→build verdes em todos)
- ~~Nada de commit ainda~~ **commit único feito e enviado em 2026-07-07** — regra "SEMPRE PUSH" plenamente em vigor de novo

## 6. Instrução de retomada

Ao reabrir a sessão com "leia o PROGRESSO.md": **as duas frentes (Bloco B + design/motion) estão commitadas e enviadas (2026-07-07)** — não repetir diagnóstico, não re-implementar, não recriar screenshots. Padrões de código a seguir: §2 deste arquivo (arquitetura `src/lib/`, `<BotaoWhatsApp>`, tokens de motion em `globals.css`, URL state via `replaceState`). Próximos trabalhos candidatos: pendências de baixa prioridade do §1b e continuação do enriquecimento do catálogo (memória do projeto).

---

# Referência durável (job anterior — Overhaul de design, concluído 2026-07-04)

## ⚠️ REGRA DE PROCESSO — SEMPRE FAZER PUSH

Toda tarefa aprovada termina com `git push origin main` **imediatamente após o commit** — nunca deixar só local. Já aconteceu 2× (fix `a9a521b`+rebrand `bbc9329` e correção de colisão `a62ca06`) do commit ficar parado local enquanto a Vercel servia versão antiga. **Checklist: commit → push → confirmar `git log origin/main..HEAD` vazio antes de reportar "concluído".** (Exceção atual: ver §5 acima.)

## Decisões congeladas / padrões a seguir

- **Tokens** (globals.css `@theme`): cru `#F6F2EB`, grafite `#332E29`, areia `#D8C3A3` (neutros das fotos) + **marca `#745C48`** e **musgo `#6A8251`** (do logo oficial), wa `#25D366` (SÓ conversão). Novos (jul/2026, auditoria): `musgo-escuro #5D7247` (texto pequeno), `wa-escuro #20B85A` (hover AA). Selo "CS" e vinho não existem mais.
- **Fontes**: Newsreader (display/serif, `axes:['opsz']`) · Albert Sans (corpo) · Spline Sans Mono (medidas/dados). Playfair/Inter removidas.
- **Assinatura**: arco-portal em molduras de foto (`rounded-t-[72px]`), ícone real da poltrona (`LogoPoltrona`), classe `.etiqueta` (globals.css) para dado técnico.
- **CTA**: rótulo único **"Consultar preço"**, verde wa, componente `<BotaoWhatsApp>` (ícone `WhatsAppIcon` embutido — nunca colar SVG/`<a>` inline). Mensagens: `mensagemProduto()`/`linkWhatsApp()`/`MENSAGENS_WHATSAPP` em `lib/whatsapp.ts` (desde o Bloco B; `mensagemWhatsApp()` de lib/produtos não existe mais). Texto dos botões WA: **grafite** (AA 6.77:1), não branco.
- **Fotos**: estúdio (fundo branco) → container branco + object-contain; ambientada → object-cover. Sempre `next/image` com `sizes`. Desde o Bloco B: loader custom Cloudinary (`images.loaderFile` → `src/lib/cloudinary-loader.ts`, `f_auto,q_auto,w_`); a config antiga (`localPatterns`/`qualities`/TTL) saiu do next.config junto com o otimizador Vercel.
- Emojis como ícone = proibido (lucide-react instalado). `ehTamanho`/`rotuloVariacao` normalizam rótulos de variação.
- **Cloudinary — public_id**: sempre incluir a extensão (`__ext` sufixo) ao derivar `public_id`/chave de mapa. Bug real: marca `lanza` tem pares `.jpg`+`.png` de nome-base igual; sem extensão colidiam e `overwrite:true` sobrescrevia (13 produtos, corrigido em `a62ca06`). Ver `scripts/upload-cloudinary.js` (`paraPublicId`, `--colisoes`).
- **Next 16**: ler docs em `node_modules/next/dist/docs/` antes de API nova; `priority` deprecated (usar `preload`/`fetchPriority`); params são Promise.
- **Lição**: `position: sticky` cria stacking context — overlay full-screen dentro de coluna sticky precisa de `createPortal(document.body)` (feito no lightbox).
- Círculo escuro "N" nos screenshots = badge do Next DevTools, só em dev — ignorar.
- Decisões de dados (2026-07-03): e-mail contato@casasinelli.com.br é real; endereço ok; horário Seg–Sex 9h–19h, Sáb 9h–17h; sem CEP no JSON-LD.

## Entregas do overhaul (histórico compacto)

| Fase | Entrega | Commit |
|---|---|---|
| 0 — Auditoria | Diagnóstico (screenshots `audit-*.jpeg`) | — |
| 1 — Design system | Direção A "Portal" + etiqueta da B aprovadas | — |
| 2a — PDP + imagens | Galeria por variação, lightbox zoom 2.5×, etiquetas de medidas, next/image (−97% na capa) | `7fef48e` |
| 2b — Header | Sticky cru+blur, nav por volume (Colchão garantido), menu mobile 25 categorias | `0c7c9b9` |
| 2c — Catálogo | Card Portal, sidebar/busca, estado vazio | `b3ea6b6` |
| 2d — Home | Hero arco, 6 categorias, Seleção curada (`DESTAQUE_IDS`), diferenciais | `ffd7466` |
| 2e — Footer/404/mapa | Footer grafite, 404 real (soft-404 removido), embed mapa | `cb70313` |
| 3 — Polimento | Focus-visible global, sitemap/robots, smoke 156 rotas, 320px ok | `f18f354` |
| Rebrand logo oficial | Tokens marca/musgo do PDF, poltrona no lugar do selo "CS", favicon | `bbc9329` |
| Fix colisão Cloudinary | Esquema `__ext`, 150 arquivos re-subidos | `a62ca06` |
| Migração Cloudinary | 1.095 imagens (100%), `cloudinary-map.json`, fallback disco local | `5476d9d`+`9c215af` |
| Aprovação retroativa | ids 127/128/129 aprovados formalmente | (dados em `248f616`) |

Pós-entrega 2026-07-04: fix galeria fotos-soltas `a9a521b` (87 produtos); pendência de deploy resolvida (imagens 100% Cloudinary).

Itens antigos ainda em aberto (baixa prioridade): preencher skills `.claude/skills/*` vazias; warning inofensivo do Turbopack (readFile da API) silenciável com `outputFileTracingExcludes`.

---

## Arquivo (job de capas, 2026-07-01)

Capas dos 121→127 produtos escolhidas e gravadas em `produtos.json` (script `scripts/analisar-capas.js`). Imagens reais em `C:\Imagens\Catalogo\` servidas por `/api/catalogo/[...slug]` (disco, nunca `public/`); nomes tipo `BOA.jpeg` = seleção manual da loja; fotos WhatsApp exigem checagem visual. Detalhes na história do git.
