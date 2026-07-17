# Casa Sinelli

Site institucional e catálogo digital da Casa Sinelli, loja de móveis. Em produção em [casasinelli.com.br](https://casasinelli.com.br).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [GSAP](https://gsap.com/) para animações e motion
- [Cloudinary](https://cloudinary.com/) para otimização e entrega de imagens
- [Vercel Analytics](https://vercel.com/analytics)
- Deploy: [Vercel](https://vercel.com/)

## Funcionalidades

- Catálogo de produtos por categoria (`/categoria/[slug]`) e página individual de produto (`/produto/[id]`)
- Imagens servidas via Cloudinary com loader customizado (`f_auto,q_auto`) para otimizar quota
- Animações com GSAP, com suporte a `prefers-reduced-motion`
- SEO: sitemap e robots gerados dinamicamente
- CTA direto para WhatsApp

## Como rodar localmente

```bash
npm install
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

### Outros scripts

```bash
npm run build           # build de produção
npm run start           # roda o build de produção
npm run lint             # lint do projeto
npm run gerar-produtos   # gera os dados de produtos usados pelo catálogo
```

## Estrutura

```
src/
├── app/    # rotas (App Router): home, catálogo, categoria, produto
├── data/   # dados de produtos e mapeamento de imagens (Cloudinary)
└── lib/    # loader customizado do Cloudinary
```

## Sobre o projeto

Site desenvolvido e mantido por mim para a Casa Sinelli (negócio da família), incluindo modelagem do catálogo, integração com Cloudinary e otimizações de performance e acessibilidade.
