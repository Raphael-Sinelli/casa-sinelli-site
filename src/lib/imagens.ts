// Resolução de URL de imagem (Cloudinary com fallback para o disco local via
// /api/catalogo) — exclusivo do servidor: o cloudinary-map.json (234 KB) não
// pode entrar no bundle do cliente. Client components recebem URLs prontas
// (ProdutoResumo.capaUrl, mapaUrlsProduto).
import 'server-only';

import cloudinaryMap from '@/data/cloudinary-map.json';
import type { Produto } from './tipos';
import { isImagemDisplay } from './catalogo-utils';

const CLOUDINARY_MAP = cloudinaryMap as Record<string, string>;

export function imagemUrl(caminho: string): string {
  const urlCloudinary = CLOUDINARY_MAP[caminho];
  if (urlCloudinary) return urlCloudinary;
  return encodeURI(`/api/catalogo${caminho}`);
}

// URLs de todas as imagens exibíveis de um produto, resolvidas no servidor —
// a galeria (client) consulta este mapa pequeno em vez do map completo.
export function mapaUrlsProduto(produto: Produto): Record<string, string> {
  const urls: Record<string, string> = {};
  for (const img of produto.todasImagens) {
    if (isImagemDisplay(img)) urls[img] = imagemUrl(img);
  }
  return urls;
}
