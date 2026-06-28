import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { todasCategorias, produtosPorCategoria } from '@/lib/produtos';
import CatalogClient from '@/components/CatalogClient';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return todasCategorias().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categorias = todasCategorias();
  const cat = categorias.find((c) => c.slug === slug);
  if (!cat) return { title: 'Categoria não encontrada' };
  return {
    title: `${cat.nome} — Catálogo`,
    description: `Veja nossa seleção de ${cat.nome.toLowerCase()} com ${cat.total} opções. Fale pelo WhatsApp para mais informações.`,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;
  const categorias = todasCategorias();
  const cat = categorias.find((c) => c.slug === slug);
  if (!cat) notFound();

  const produtos = produtosPorCategoria(slug);

  return (
    <CatalogClient
      produtos={produtos}
      categorias={categorias}
      categoriaInicial={slug}
    />
  );
}
