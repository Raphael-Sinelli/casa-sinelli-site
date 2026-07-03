import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // fotos servidas do disco por /api/catalogo; o otimizador do Next
    // busca nessa rota, redimensiona (sharp) e cacheia em .next/cache/images
    localPatterns: [{ pathname: "/api/catalogo/**" }],
    qualities: [60, 75, 85],
    minimumCacheTTL: 2678400, // 31 dias — os arquivos do catálogo não mudam de conteúdo
  },
};

export default nextConfig;
