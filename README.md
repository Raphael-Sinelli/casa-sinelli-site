# Casa Sinelli

Site institucional / e-commerce da **Casa Sinelli**, loja de móveis e colchões em Ribeirão Pires-SP.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/deployed_on-Vercel-black?logo=vercel)](https://vercel.com/)

🔗 **Produção:** [casasinelli.com.br](https://casasinelli.com.br)

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS 4
- **Motion:** GSAP
- **Imagens:** Cloudinary (CDN + otimização de formato/qualidade na borda)
- **Ícones:** lucide-react
- **Analytics:** Vercel Analytics
- **Lint:** ESLint 9
- **Testes end-to-end:** Playwright

## Features principais

- **Catálogo de produtos com variação de cor** — seletor de swatches derivado da estrutura de pastas/imagens do produto, sem dado manual duplicado.
- **CDN de imagens via Cloudinary** — mapa de URLs pré-resolvido no servidor, com fallback para disco local em desenvolvimento.
- **Performance:** DTO de catálogo reduz o HTML enviado ao cliente de ~1 MB para ~32 KB gzip.
- **Motion com GSAP** — hero, cards, menu e CTA de WhatsApp animados, respeitando `prefers-reduced-motion`.
- **Acessibilidade** — zero violações no axe-core.
- **Conversão via WhatsApp** — CTA direto de cada produto para `wa.me`, sem formulário intermediário.

## Como rodar localmente

```bash
git clone <url-do-repo>
cd casa-sinelli-site
npm install
cp .env.example .env.local   # preencha com suas próprias credenciais Cloudinary
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Outros scripts

```bash
npm run build           # build de produção
npm run start            # roda o build de produção
npm run lint              # lint do projeto
npm run gerar-produtos    # gera os dados de produtos usados pelo catálogo
```

## Estrutura de pastas

```
src/
  app/            # rotas (App Router)
  components/     # componentes de UI
  lib/            # utilitários, tipos, motion, resolução de imagens
  data/           # dados do catálogo (JSON) e mapa Cloudinary
scripts/          # scripts de build de dados e upload de imagens
public/           # assets estáticos
```

## Licença

Uso proprietário — veja [LICENSE](./LICENSE). Este repositório é público apenas como referência de portfólio.
