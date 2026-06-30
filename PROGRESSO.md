# Progresso — Escolha de capa (imagem principal) dos 120 produtos

**Status:** EM ANDAMENTO — análise pronta e validada visualmente, **nada gravado ainda** em `produtos.json`. Falta auditar sofás alpoim e obter aprovação da amostra antes do `--write`.

**Última sessão:** 2026-06-30

---

## Objetivo

Corrigir a capa de TODOS os 120 produtos em `src/data/produtos.json` seguindo a regra:

- **Prioridade 1 — ambientada:** móvel dentro de cômodo decorado (parede/piso/cortina/decor), produto INTEIRO, sem cortes.
- **Prioridade 2 — estúdio/isolada (fallback):** produto inteiro em fundo neutro/branco limpo.
- **Nunca capa:** close-up/detalhe, mão tocando, produto cortado, produto aberto mostrando interior, gráficos/tabelas/fichas técnicas.

---

## O que já foi feito

### Script principal: `scripts/analisar-capas.js`

Analisa todas as imagens candidatas com **sharp** e escolhe a capa. Modos:

```
node scripts/analisar-capas.js              # calibração: imprime distribuição das métricas (não grava)
node scripts/analisar-capas.js --escolher   # aplica regra, imprime AMOSTRA de 15 (não grava)
node scripts/analisar-capas.js --escolher --write   # grava a capa em produtos.json
```

**Métricas por imagem (sharp):**
- `stdevMean` — desvio padrão médio de cor (canais R,G,B via `stats().channels[].stdev`).
- `cornerStdev` / `cornerBright` — média da textura/brilho dos 4 cantos (recorte ~16% de cada canto). **IMPORTANTE:** `.stats()` opera na imagem de ENTRADA; para analisar o canto é preciso materializar o recorte em buffer (`.extract().toBuffer()`) e rodar `sharp(buf).stats()` — senão retorna a imagem inteira.
- `whiteCorners` — quantos dos 4 cantos são "fundo branco/liso" (brilho ≥232 e stdev ≤16).

**Filtro de nome `nomeRuim()`** (nunca pode ser capa):
- substrings: detalhe, close, zoom, **abert** (aberto/aberta), interno, interna, pessoa, tabela, pesosuportado, medida, ficha, grafico, diagrama.
- tokens exatos (separados por não-alfanumérico): med, cota, dimensao, mao, desenho, tecnico… → pega diagramas tipo `...MED-RGB`.

**Classificação `ehAmbientada(s)`** (validada visualmente com ground truth):
- tem canto branco (`whiteCorners ≥ 1`) → isolada
- cantos muito lisos (`cornerStdev ≤ 14`) → isolada
- produto preenche o quadro / render frontal (`cornerBright ≥ 198 && cornerStdev ≥ 40`) → isolada
- senão → **ambientada** (cena ao redor)

**Ranking dentro de cada grupo:**
- ambientada → maior arquivo (melhor resolução entre as cenas).
- estúdio → mais cantos brancos (isolado mais limpo) e desempate por tamanho.

### Resultado atual (`--escolher`)

- 120 produtos: **ambientada ≈ 103**, estúdio/isolada ≈ 16, sem-análise 1.

### Validação visual feita (contact sheets gerados com sharp)

- **Grupo ambientada (30 amostras):** 29/30 corretas (cenas reais de cômodo). **1 falha conhecida: #25 (alpoim/Sofá Agar)** — escolheu close-up com mão tocando o sofá, produto cortado. Foto WhatsApp, nome não filtrável.
- **Grupo estúdio (16):** todas são capas válidas de produto inteiro. Porém ~5-6 são na verdade cenas reais rotuladas como "estúdio" (têm cantos brancos por parede branca/moldura): #39, #42, #100, #109. A CAPA escolhida está boa; só o RÓTULO subestima (cosmético, não troca a imagem).

### Ground truth confirmado (visualmente)

| Imagem | wc | cBright | cStdev | É |
|---|---|---|---|---|
| Cama Bibox branca.png | 0 | 168 | 30 | ambientada (quarto) |
| fogão preto.png | 0 | 196 | 22 | ambientada (cozinha) |
| Roupeiro Dubai Ipe.jpg | 0 | 175 | 24 | ambientada (quarto c/ lustre) |
| Cozinha Firenze 5pç RGB | 0 | 141 | 28 | ambientada (cozinha montada) |
| FI Frontal Roupeiro Ipe.png | 0 | 215 | 74 | render frontal (preenche quadro) → isolada |
| Roupeiro Dubai Ipe.png | 3 | 254 | 7 | estúdio fundo branco |

---

## O que FALTA fazer

1. **Auditar os 9 sofás alpoim (#24–#32)** — todos são fotos WhatsApp (bagunçadas, com close-ups/mãos/cortes). Verificar se a capa escolhida de cada um mostra o sofá INTEIRO sem mão/corte. Já existe modo de montagem por ids:
   ```
   node <scratchpad>/montagem.js ids:24,25,26,27,28,29,30,31,32 9
   ```
   Provável necessidade: filtro extra para fotos WhatsApp close-up (difícil por nome — talvez detectar produto cortado/baixa proporção de cena, ou escolher manualmente).
2. **(Opcional) Refinar rótulo** das cenas com parede branca classificadas como estúdio (#39, #42, #100, #109). Só afeta o rótulo, não a capa. Baixa prioridade.
3. **Apresentar a amostra de 15 ao usuário e obter aprovação.**
4. **Gravar:** `node scripts/analisar-capas.js --escolher --write`.
5. Conferir o site renderizando as novas capas.

---

## Arquivos / artefatos

- `scripts/analisar-capas.js` — script definitivo (versionado no projeto).
- **Cache de stats e dumps ficam no scratchpad da sessão** (`.../scratchpad/stats-cache.json`, `escolhas.json`, `sheet-*.png`, `montagem.js`). O caminho do cache (`CACHE`) está **hardcoded com o ID da sessão atual** dentro de `analisar-capas.js` — em nova sessão o ID muda. **Ação:** ao retomar, ajustar a constante `CACHE` para o scratchpad da nova sessão (ou para um caminho fixo). O cache se reconstrói sozinho ao rodar (≈2-3 min p/ 992 imagens); `montagem.js` precisa ser recriado (está só no scratchpad).
- `escolhas.json` (gerado pelo `--escolher`) — mapa id→capa+grupo+stats, consumido pela montagem.

## Decisões/aprendizados importantes

- Distribuição de `stdevMean` é **unimodal** (~55) → desvio de cor sozinho NÃO separa ambientada de estúdio. O sinal que funciona é **análise de cantos** (fundo branco/liso) + regra de "render frontal preenche quadro".
- `.extract().stats()` no sharp **não** recorta para o stats — materializar buffer antes.
- Imagens reais ficam em `C:\Imagens\Catalogo\` + caminho web do JSON (NÃO em `public/`); paths com acento (ex.: `fogão`) quebram cópia/Read via shell — resolver pelo JSON.
