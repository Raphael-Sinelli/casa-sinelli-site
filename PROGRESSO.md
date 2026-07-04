# PROGRESSO — Overhaul de design (prompt-design-casa-sinelli-final.md)

**Última sessão:** 2026-07-03
**Fonte da verdade do job:** `prompt-design-casa-sinelli-final.md` (raiz) — trabalho em fases com **portão de aprovação do usuário ao fim de cada fase**.

## ✅ PROJETO CONCLUÍDO (2026-07-04) — + hotfix e rebrand pós-entrega

Pós-entrega (2026-07-04): (a) **fix da galeria** `a9a521b` — 87 produtos com fotos soltas (variações vazias) caíam em "Foto em breve" na PDP (regressão da 2a); fallback para todasImagens restaurado, smoke 87/87 ok. (b) **Logo oficial adotado** `bbc9329` — selo "CS" e vinho eram invenção; tokens agora: **marca `#745C48`** (marrom do wordmark) e **musgo `#6A8251`** (verde da poltrona), extraídos do PDF oficial (`public/Casa_Sinelli_logo_alta_qualidade.pdf`); ícone da poltrona (`LogoPoltrona`/`public/logo-poltrona.png`) em header/404/erro/placeholders/CTA; logo completo no footer (cartão cru); favicon novo (`src/app/icon.png`). Regra: musgo nunca em botão (verde-botão é exclusivo do WhatsApp). Redimensionamento p/ produção: `C:\Imagens\Catalogo_producao_2048` (786MB, aguardando decisão de storage).

Todas as fases do overhaul foram entregues e aprovadas. Relatório final de entregáveis (Seção 9 do prompt) entregue na sessão de 2026-07-04. Site na identidade "Portal" completa, build limpo, 156 rotas ok, lint zerado.

Próximos passos recomendados (fora do escopo do prompt, aguardando decisão do usuário):
1. Deploy: definir como as imagens de C:\Imagens\Catalogo chegam à Vercel (a API lê disco local — em produção precisa de storage/objeto ou build-time copy).
2. Contraste do verde WhatsApp #25D366 com texto branco (~2:1) fica abaixo de AA — mantido por reconhecimento da marca WhatsApp (trade-off consciente de conversão). Se quiser AA estrito, usar wa-escuro como fundo dos botões.
3. Preencher as skills vazias (.claude/skills/casa-sinelli-design, ui-audit, catalog-ux, whatsapp-conversion) com o sistema aprovado.
4. Warning do Turbopack no build (análise estática do readFile da API de imagens) é inofensivo; silenciável com outputFileTracingExcludes se incomodar.
5. Cadastro dos 3 produtos fora do site (tanquinho laveMais, guarda-roupa albatroz Sole, sofá paropas) — ver relatorio-bugs-auditoria.txt.

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
| 3 — Polimento final | Focus-visible global, headings de controle corrigidos (role=group), menu com entrada suave + fechar-no-clique (lint zerado), sitemap.xml + robots.txt dos dados, smoke 156 rotas, 320px sem overflow, tablet 768 validado | `f18f354` |

## Falta fazer

- **2e — Footer, 404, estados, mapa**: footer completo na identidade nova (sem emojis); `not-found.tsx` (hoje 404 default do Next em inglês); estados vazio/erro/carregamento pt-BR; **corrigir Google Maps embed** — o atual é placeholder falso (renderiza em branco); usuário já aprovou embed real de Av. Francisco Monteiro 1320, Ribeirão Pires.
- **Fase 3 — Polimento**: micro-interações discretas, acessibilidade (foco, contraste, headings, reduced-motion), performance (LCP mobile, re-render), responsividade 320→1366+, SEO local, copywriting, rodar ui-audit + build final + relatório de entregáveis (Seção 9 do prompt).

## Decisões congeladas / padrões a seguir

- **Tokens** (globals.css `@theme`): cru `#F6F2EB`, grafite `#332E29`, areia `#D8C3A3` (neutros das fotos) + **marca `#745C48`** e **musgo `#6A8251`** (do logo oficial), wa `#25D366` (SÓ conversão). Selo "CS" e vinho não existem mais.
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
