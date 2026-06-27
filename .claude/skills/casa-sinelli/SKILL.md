---
name: casa-sinelli
description: Contexto geral da Casa Sinelli — identidade, produtos, público e regras de negócio
---

# Casa Sinelli — Contexto Geral

## Identidade da Marca

- **Nome:** Casa Sinelli
- **Tipo:** Loja física de móveis e colchões
- **Localização:** Ribeirão Pires, SP
- **Contato WhatsApp:** a confirmar (número da loja não definido ainda)
- **Objetivos do site:**
  1. Atrair clientes pela internet e gerar contato via WhatsApp
  2. Funcionar como catálogo digital interno durante atendimento na loja

---

## Catálogo de Produtos

### Dimensão do catálogo (inventário de junho/2026)

- **128 produtos únicos** identificados
- **1.032 imagens** de produto
- **38 marcas/fornecedores**

### Categorias e quantidade de produtos

| Categoria | Qtd |
|---|---:|
| Guarda-roupas | 21 |
| Sofás | 13 |
| Cozinhas | 13 |
| Camas | 14 |
| Cômodas | 10 |
| Armários (buffets, cristaleiras, aparadores, fruteiras) | 9 |
| Racks e painéis | 9 |
| Outros | 9 |
| Multiusos | 5 |
| Poltronas | 4 |
| Mesas e escrivaninhas | 6 |
| Colchões | 7 |
| Eletrodomésticos | 3 |
| Cabeceiras | 2 |
| Cadeiras | 2 |
| Balcões | 1 |

### Exemplos de produtos por categoria

**Sofás:** Sofá México retrátil (cinza/marrom), Sofá Zara retrátil, Sofá-cama

**Camas:** Beliche Itália, Beliche Palmo, Bicama Confort Castanho, Cama Montreal casal, Cama Solteiro Siena, Triliche Itália, Berço Magia

**Guarda-roupas:** Sole 2 portas de correr com espelho (Albatroz), Fit 2/3/4/6 portas (Santos Andira), Buriti 4/6 portas (Santos Andira), Roupeiro Dubai/Gênova/Lion/Pádua (Lanza), Araguaia/Aruba/Atenas (Moval)

**Cozinhas:** Firenze 5/8 peças (Indekes), Monza 5/6/8 peças (Indekes), Kits Braga/Porto/Sintra (Indekes), Kits Liv/Nature/Zen (Kits Paraná), Barcelona (Poliman)

**Colchões:** Ecoflex espuma D33, Ecoflex espuma floral, Hellen Lisboa mola ensacada, Hellen Omega mola ensacada, Prorelax Turquesa D33

**Eletrodomésticos:** Cooktop Itatiaia 5 bocas, Fogão Itatiaia 4 bocas, Tanquinho Branco Superstar

---

## Fornecedores / Marcas

38 marcas com pasta própria em `C:\Imagens\Catalogo\`:

`albatroz` · `alpoim` · `aparador` · `açoNobre` · `batrol` · `bechara` · `BomJesus` · `Cambel` · `colibri` · `Demobile` · `dj` · `ecoflex` · `hellen` · `indekes` · `Itatiaia` · `kamabel` · `kitsParana` · `lanza` · `laveMais` · `lopas` · `luciane` · `Lukaliam` · `modelar` · `moval` · `mundial` · `paropas` · `piner` · `poliman` · `primus` · `prorelax` · `quartaDivisão` · `SantosAndira` · `sofa` · `songes` · `valdemoveis` · `Viero`

---

## Estrutura de Arquivos do Catálogo

Pasta raiz: `C:\Imagens\Catalogo\` — **nunca alterar, apenas ler.**

### Hierarquia padrão

```
C:\Imagens\Catalogo\
└── <marca>/                          ← pasta do fornecedor
    └── <modelo>/                     ← pasta do produto
        ├── <COR-1>/                  ← subpasta de variação de cor (quando há)
        │   └── imagem.png
        ├── <COR-2>/
        │   └── imagem.png
        ├── imagem-principal.jpg      ← imagem direta (quando sem subpastas de cor)
        ├── medidas.txt               ← dimensões do produto
        ├── medidasEinformacoes.txt   ← medidas + descrição técnica
        └── LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt  ← URL do fabricante
```

### Tipos de arquivo

| Tipo | Uso |
|---|---|
| `.jpg`, `.jpeg`, `.png`, `.webp`, `.HEIC` | Imagens de produto |
| `.mp4`, `.MOV` | Vídeos de produto |
| `.txt` | Medidas, informações técnicas e links de referência |
| `.md` | Inventário e documentação |
| `.json` | Dados estruturados auxiliares |
| `.pdf` | Catálogos e logo da loja |

---

## Modelo de Dados do Produto

```
{
  marca: string,           // nome da pasta pai (ex: "albatroz")
  modelo: string,          // nome da pasta do produto (ex: "GUARDA ROUPA SOLE...")
  categoria: string,       // sofá | cama | guarda-roupa | cozinha | colchão | eletrodoméstico | ...
  cores: string[],         // nomes das subpastas de cor (ex: ["CINAMOMO-OFF", "NOGUEIRA-CAPPUCCINO"])
  imagens: string[],       // caminhos relativos dos arquivos de imagem
  medidas: string,         // conteúdo de medidas.txt
  informacoes: string,     // conteúdo de medidasEinformacoes.txt
  link_referencia: string  // conteúdo de LINK-DO-SITE-REFERENCIAS-E-PRODUTOS.txt
}
```

---

## Público-Alvo

- Moradores da região de Ribeirão Pires e ABC Paulista
- Famílias montando ou reformando casa (quarto, sala, cozinha)
- Clientes que pesquisam online antes de visitar a loja física
- Vendedores da loja usando o catálogo digital durante atendimento

---

## Canais de Venda

| Canal | Status |
|---|---|
| Loja física (Ribeirão Pires, SP) | Ativo |
| WhatsApp | Ativo — número a confirmar |
| Site (catálogo digital) | Em desenvolvimento |

---

## Regras de Negócio

- **Não alterar** a pasta `C:\Imagens\Catalogo\` — apenas leitura
- **Não alterar** as cores reais das imagens de produto
- **Não usar** imagens enganosas ou de produtos que não estão no catálogo
- O número de WhatsApp da loja deve ser confirmado antes de publicar CTAs
- O catálogo começa com **dados estáticos** (sem banco de dados)
- Produtos têm variações de cor — exibir todas as opções disponíveis
- Inventário de referência: `C:\Imagens\Catalogo\INVENTARIO_PRODUTOS_CASA_SINELLI.md`
