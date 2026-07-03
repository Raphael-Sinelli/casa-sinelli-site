'use client';

import { useMemo, useState } from 'react';
import type { Produto } from '@/lib/tipos';
import {
  gruposDeCor,
  variacaoInicial,
  variacoesDisplay,
} from '@/lib/produtos';
import ProductGallery from './ProductGallery';
import VariacaoSelector from './VariacaoSelector';

interface Props {
  produto: Produto;
}

function capaPrimeiro(imagens: string[], capa: string | null | undefined): string[] {
  if (!capa || !imagens.includes(capa)) return imagens;
  return [capa, ...imagens.filter((i) => i !== capa)];
}

export default function ProductDetailClient({ produto }: Props) {
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
    const doGrupo = temCores
      ? grupos.find((g) => g.cor === grupoAtivo)?.imagens ?? []
      : grupos.flatMap((g) => g.imagens);
    return capaPrimeiro(doGrupo, produto.capa);
  }, [grupos, grupoAtivo, temCores, produto.capa]);

  return (
    <div className="flex flex-col gap-5">
      <ProductGallery
        key={`${corVariacao}|${grupoAtivo}`}
        imagens={imagens}
        nomeProduto={produto.nome}
      />
      <VariacaoSelector
        variacoes={variacoes}
        variacaoAtiva={corVariacao}
        onVariacao={trocarVariacao}
        grupos={grupos}
        grupoAtivo={grupoAtivo}
        onGrupo={setGrupoAtivo}
      />
    </div>
  );
}
