'use client';

import { useMemo, useState } from 'react';
import type { Produto } from '@/lib/tipos';
import {
  gruposDeCor,
  isImagemDisplay,
  variacaoInicial,
  variacoesDisplay,
} from '@/lib/catalogo-utils';
import ProductGallery from './ProductGallery';
import VariacaoSelector from './VariacaoSelector';

interface Props {
  produto: Produto;
  /** caminho da imagem → URL final, resolvido no servidor (mapaUrlsProduto). */
  urls: Record<string, string>;
}

function capaPrimeiro(imagens: string[], capa: string | null | undefined): string[] {
  if (!capa || !imagens.includes(capa)) return imagens;
  return [capa, ...imagens.filter((i) => i !== capa)];
}

export default function ProductDetailClient({ produto, urls }: Props) {
  const variacoes = variacoesDisplay(produto);
  const [corVariacao, setCorVariacao] = useState(() => variacaoInicial(produto));

  const grupos = useMemo(
    () => gruposDeCor(produto, corVariacao),
    [produto, corVariacao]
  );

  const grupoInicial = (gs: typeof grupos) => {
    const dono = produto.capa ? gs.find((g) => g.imagens.includes(produto.capa!)) : undefined;
    return (dono ?? gs[0])?.cor ?? null;
  };

  const [grupoAtivo, setGrupoAtivo] = useState<string | null>(() => grupoInicial(grupos));

  const trocarVariacao = (cor: string) => {
    setCorVariacao(cor);
    setGrupoAtivo(grupoInicial(gruposDeCor(produto, cor)));
  };

  const temCores = grupos.filter((g) => g.cor !== null).length > 1;
  const imagens = useMemo(() => {
    // sem nenhuma variação com foto (fotos soltas na pasta do produto):
    // galeria usa todas as imagens exibíveis do produto
    if (variacoes.length === 0) {
      return capaPrimeiro(produto.todasImagens.filter(isImagemDisplay), produto.capa);
    }
    const doGrupo = temCores
      ? grupos.find((g) => g.cor === grupoAtivo)?.imagens ?? []
      : grupos.flatMap((g) => g.imagens);
    return capaPrimeiro(doGrupo, produto.capa);
  }, [variacoes.length, grupos, grupoAtivo, temCores, produto.capa, produto.todasImagens]);

  return (
    <div className="flex flex-col gap-5">
      <ProductGallery
        key={`${corVariacao}|${grupoAtivo}`}
        imagens={imagens}
        urls={urls}
        nomeProduto={produto.nome}
      />
      {/* id="cores": alvo do mini-sumário da PDP (scroll-mt compensa o header sticky) */}
      <div id="cores" className="scroll-mt-24">
        <VariacaoSelector
          variacoes={variacoes}
          variacaoAtiva={corVariacao}
          onVariacao={trocarVariacao}
          grupos={grupos}
          grupoAtivo={grupoAtivo}
          onGrupo={setGrupoAtivo}
        />
      </div>
    </div>
  );
}
