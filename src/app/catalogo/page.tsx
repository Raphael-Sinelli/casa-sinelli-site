import type { Metadata } from 'next';
import { todosOsProdutos, todasCategorias } from '@/lib/produtos';
import CatalogClient from '@/components/CatalogClient';

export const metadata: Metadata = {
  title: 'Catálogo de Móveis e Colchões',
  description: 'Explore nosso catálogo completo com guarda-roupas, sofás, camas, colchões, mesas e muito mais. Atendimento pelo WhatsApp.',
};

export default function CatalogoPage() {
  const produtos = todosOsProdutos();
  const categorias = todasCategorias();

  return <CatalogClient produtos={produtos} categorias={categorias} />;
}
