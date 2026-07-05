# PROGRESSO — Auditoria de front-end (jul/2026)

**Última sessão:** 2026-07-05
**Job atual:** auditoria completa de front-end (a11y, guidelines, perf, arquitetura, responsivo/motion) → implementação em bloco único com gates.

## 1. Status geral

Diagnóstico completo (Etapas 1-5) finalizado. Bloco B (implementação) aprovado, ainda não iniciado.

## 2. Decisões travadas (não perguntar de novo)

- Contraste WhatsApp: texto grafite (`#332E29`) sobre o verde atual — **já implementado** (working tree, ainda não commitado; ver §5)
- Imagens: **Cloudinary loader custom** (`f_auto,q_auto,w_`) em vez do otimizador Vercel
- Animação: pacote **"Micro + assinatura"** (micro-interações + 1 entrada assinatura no hero da home, stagger sutil na grade "Seleção da loja", tudo com `prefers-reduced-motion`)
- Galeria: **swipe mobile habilitado**
- FAB WhatsApp: **oculto na primeira dobra da home**, aparece após ~1 tela (demais páginas: sempre visível)
- Paleta de cores da marca: **NUNCA alterar** — base é o logo Casa Sinelli (cru, grafite, marca, areia, musgo). Tokens novos derivados já aprovados: `musgo-escuro #5D7247` (texto pequeno AA) e `wa-escuro` recalibrado `#20B85A` (hover AA com texto grafite)

## 3. Achados consolidados das auditorias (resumo)

- **Acessibilidade:** 186→0 violações (engine @accesslint/core, 5 páginas). Corrigido no working tree — **não commitado ainda**
- **Web Interface Guidelines:** lightbox sem focus trap/retorno de foco, URL state ausente no catálogo (`?busca=`), skip link ausente, `role=listbox` incorreto nas miniaturas — pendentes
- **Performance:** `cloudinary-map.json` inteiro no bundle do cliente (234 KB), HTML do catálogo em 1 MB por payload RSC não-enxuto (127× Produto completo), risco de quota Vercel (1.095 imagens-fonte vs limite 1.000/mês do Hobby) — pendentes
- **Composition patterns:** botão WhatsApp duplicado em 11 lugares (fix de contraste tocou 11 arquivos), `lib/produtos.ts` misturando server e client (causa do vazamento de bundle) — pendentes

## 4. Tabela de implementação aprovada (Bloco B)

| # | Item | Conteúdo | Status |
|---|------|----------|--------|
| 1 | Fundação | `<BotaoWhatsApp>` único (mata 11 duplicações) · split `lib/` em `catalogo-server.ts` (`server-only`) + `catalogo-utils.ts` puro · constantes WhatsApp centralizadas | pendente |
| 2 | Imagens & bundle | Loader custom Cloudinary (`f_auto,q_auto,w_`) · `cloudinary-map` sai do cliente (−234 KB JS) · DTO enxuto no catálogo (HTML 1 MB → ~350 KB) | pendente |
| 3 | Rendering | Preload das imagens LCP (hero, galeria) — **atenção: `priority` é deprecated no Next 16, conferir API `preload`/`fetchPriority` em `node_modules/next/dist/docs/` antes** · `React.memo(ProductCard)` + `useDeferredValue(busca)` · `content-visibility: auto` nos cards · `sizes` 25vw→33vw | pendente |
| 4 | Galeria & Lightbox | Extração `<Lightbox>` · focus trap + retorno de foco · zoom por teclado · remove `role=listbox` das miniaturas · hook `useEscapeETravaScroll` · crossfade 150ms na troca de foto · entrada fade+scale do lightbox · swipe na galeria mobile | pendente |
| 5 | Navegação & polish | URL state no catálogo (`?busca=`) · skip link · SearchBar (`transition-all`→específico, `focus-visible:`, `name`/`autocomplete`/`spellCheck`) · `aria-controls` no filtro mobile · `overscroll-contain` (menu + lightbox) · `themeColor` cru · `text-balance` em headings | pendente |
| 6 | Responsivo fino | Grade "Seleção" 1 col até 420px · touch targets ≥44px nos chips (`pointer: coarse`) · FAB com `safe-area-inset-bottom` | pendente |
| 7 | Motion pack | `active:scale-[0.98]` nos CTAs · hero da home: entrada fade/rise escalonada 1× (500ms, ease-out-quart) · stagger 40ms só na grade "Seleção da loja" · FAB aparece após 1 tela na home · tudo com `prefers-reduced-motion` | pendente |

## 5. Regras de processo (obrigatório seguir ao retomar)

- Executar itens 1→7 em sequência
- Cada item passa por spartan-ai-toolkit (**typecheck → lint → build**) antes de o usuário revisar
- Interromper e perguntar SOMENTE se: gate quebrar, surgir decisão visível nova ao usuário, ou algo fora do escopo mapeado
- Ao final de tudo: **resumo único + diffs + screenshots Playwright (desktop+mobile)** antes de qualquer commit de código
- **Nada de commit do código ainda** — só ao final do Bloco B completo, com aprovação do usuário. As correções de acessibilidade (10 arquivos) estão no working tree aguardando esse commit final
- Push deste snapshot: **intencionalmente pendente por ordem do usuário** (exceção pontual à regra "sempre push" abaixo — usuário decide quando)

## 6. Instrução de retomada

Ao reabrir a sessão com "leia o PROGRESSO.md": ler este arquivo, confirmar com o usuário em 1 frase o estado atual, e perguntar se pode iniciar o Bloco B a partir do item 1. **Não repetir diagnóstico já feito.**

---

# Referência durável (job anterior — Overhaul de design, concluído 2026-07-04)

## ⚠️ REGRA DE PROCESSO — SEMPRE FAZER PUSH

Toda tarefa aprovada termina com `git push origin main` **imediatamente após o commit** — nunca deixar só local. Já aconteceu 2× (fix `a9a521b`+rebrand `bbc9329` e correção de colisão `a62ca06`) do commit ficar parado local enquanto a Vercel servia versão antiga. **Checklist: commit → push → confirmar `git log origin/main..HEAD` vazio antes de reportar "concluído".** (Exceção atual: ver §5 acima.)

## Decisões congeladas / padrões a seguir

- **Tokens** (globals.css `@theme`): cru `#F6F2EB`, grafite `#332E29`, areia `#D8C3A3` (neutros das fotos) + **marca `#745C48`** e **musgo `#6A8251`** (do logo oficial), wa `#25D366` (SÓ conversão). Novos (jul/2026, auditoria): `musgo-escuro #5D7247` (texto pequeno), `wa-escuro #20B85A` (hover AA). Selo "CS" e vinho não existem mais.
- **Fontes**: Newsreader (display/serif, `axes:['opsz']`) · Albert Sans (corpo) · Spline Sans Mono (medidas/dados). Playfair/Inter removidas.
- **Assinatura**: arco-portal em molduras de foto (`rounded-t-[72px]`), ícone real da poltrona (`LogoPoltrona`), classe `.etiqueta` (globals.css) para dado técnico.
- **CTA**: rótulo único **"Consultar preço"**, verde wa, ícone `WhatsAppIcon` (componente único — nunca colar o SVG inline). Mensagem: `mensagemWhatsApp()` em lib/produtos. Texto dos botões WA: **grafite** (AA 6.77:1), não branco.
- **Fotos**: estúdio (fundo branco) → container branco + object-contain; ambientada → object-cover. Sempre `next/image` com `sizes` (config: `localPatterns /api/catalogo/**`, `qualities [60,75,85]`, cache 31d).
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
