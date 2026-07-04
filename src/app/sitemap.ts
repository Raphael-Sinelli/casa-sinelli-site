import type { MetadataRoute } from 'next';
import { todosOsProdutos, todasCategorias } from '@/lib/produtos';

const BASE = 'https://casasinelli.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/catalogo`, changeFrequency: 'weekly', priority: 0.9 },
  ];

  const categorias: MetadataRoute.Sitemap = todasCategorias().map((c) => ({
    url: `${BASE}/categoria/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const produtos: MetadataRoute.Sitemap = todosOsProdutos().map((p) => ({
    url: `${BASE}/produto/${p.id}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...estaticas, ...categorias, ...produtos];
}
