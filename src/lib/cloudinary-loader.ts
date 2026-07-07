// Loader custom do next/image: as transformações (formato, qualidade e
// largura) acontecem na borda do Cloudinary — o otimizador da Vercel não é
// usado (evita a quota de 1.000 imagens-fonte/mês do plano Hobby).
export default function cloudinaryLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith('https://res.cloudinary.com/')) {
    return src.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
  }
  // fallback (disco local via /api/catalogo e assets estáticos): sem transformação
  return src;
}
