# Progresso — Escolha de capa (imagem principal) dos produtos

**Status:** CONCLUÍDO — gravado em `produtos.json` (121 produtos).

**Última sessão:** 2026-07-01

---

## O que foi feito

1. `scripts/analisar-capas.js` rodado com `--escolher --write`: 104 ambientada, 16 estúdio/isolada, 1 sem-análise.
2. Auditados os 9 sofás alpoim (#24–32, fotos WhatsApp bagunçadas). 4 tinham capa ruim (close-up/mão/produto cortado) e foram corrigidos manualmente:
   - #25 Sofá Agar → `2,30M/Azul/WhatsApp Image 2025-07-17 at 11.38.51 (1).jpeg`
   - #26 Sofá Aline → `Bege/BOA.jpeg` (já existia foto pré-selecionada manualmente na pasta, sem uso até então)
   - #29 Sofá Fortaleza → `cinza/a4ab30edfe9d93d1ae883ba46e62a87c69e0f7409f7f0.webp`
   - #32 Sofá Recife → `Marrom/convertidas/IMG_2261.jpg`
   Os outros 5 (#24, #27, #28, #30, #31) já estavam corretos.
3. Validado no dev server: as 4 páginas corrigidas respondem 200 e mostram a capa nova.

## Arquivos / artefatos

- `scripts/analisar-capas.js` — script definitivo. `CACHE` agora fixo em `os.tmpdir()/casa-sinelli-capas-cache.json` (não amarrado a sessão — antes quebrava entre sessões).
- Cache de stats em `<tmpdir>/casa-sinelli-capas-cache.json`, dump de escolhas em `<tmpdir>/escolhas.json`.

## Decisões/aprendizados importantes

- Distribuição de `stdevMean` é unimodal (~55) → desvio de cor sozinho não separa ambientada de estúdio. Sinal que funciona: análise de cantos (fundo branco/liso) + regra de "render frontal preenche quadro".
- `.extract().stats()` no sharp não recorta para o stats — materializar buffer antes.
- Imagens reais ficam em `C:\Imagens\Catalogo\` (servidas via `/api/catalogo/[...slug]` que lê direto do disco), NÃO em `public/`.
- Fotos WhatsApp em sequência de "toque" (mão tocando produto) passam no filtro automático porque não têm fundo branco nem nome ruim — exigem checagem visual manual quando o produto vem de sessão de fotos tipo showroom/WhatsApp.
- Nomes de arquivo tipo `BOA.jpeg`, `ok.jpeg`, `ta.jpeg`, `COLOCA ESSA.jpeg` em pastas de produto indicam seleção manual prévia de alguém da loja — vale checar essas primeiro ao auditar capa de um produto.
