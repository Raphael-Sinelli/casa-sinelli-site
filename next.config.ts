import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Transformações direto no Cloudinary (f_auto,q_auto,w_) — o otimizador
    // da Vercel fica fora do caminho (quota Hobby: 1.000 imagens-fonte/mês).
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
