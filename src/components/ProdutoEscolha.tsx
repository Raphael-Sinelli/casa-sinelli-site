'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { Produto, Variacao } from '@/lib/tipos';
import type { GrupoCor } from '@/lib/catalogo-utils';
import {
  gruposDeCor,
  rotuloSelecao,
  variacaoInicial,
  variacoesDisplay,
} from '@/lib/catalogo-utils';

interface Escolha {
  variacoes: Variacao[];
  corVariacao: string;
  trocarVariacao: (cor: string) => void;
  grupos: GrupoCor[];
  grupoAtivo: string | null;
  setGrupoAtivo: (cor: string | null) => void;
  /** rótulo do bloco de seleção, ou null quando ele não renderiza nada */
  rotulo: 'Cores' | 'Tamanho' | 'Modelo' | null;
}

const Ctx = createContext<Escolha | null>(null);

export function useEscolha(): Escolha {
  const valor = useContext(Ctx);
  if (!valor) throw new Error('useEscolha exige <ProdutoEscolha> acima na árvore');
  return valor;
}

/**
 * Dono do estado de variação/cor da PDP.
 *
 * O mini-sumário (coluna do título) e o seletor (coluna da galeria) são irmãos
 * no grid, então nenhum dos dois pode segurar o estado. O estado também não
 * pode ficar no servidor: o atalho precisa sumir quando o tamanho ativo não
 * tem cor, e o servidor não sabe qual tamanho está ativo.
 *
 * Provider não emite DOM — o grid segue vendo header/galeria/infos como filhos
 * diretos.
 */
export default function ProdutoEscolha({
  produto,
  children,
}: {
  produto: Produto;
  children: React.ReactNode;
}) {
  const variacoes = useMemo(() => variacoesDisplay(produto), [produto]);
  const [corVariacao, setCorVariacao] = useState(() => variacaoInicial(produto));
  const grupos = useMemo(() => gruposDeCor(produto, corVariacao), [produto, corVariacao]);

  const grupoInicial = (gs: GrupoCor[]) => {
    const dono = produto.capa ? gs.find((g) => g.imagens.includes(produto.capa!)) : undefined;
    return (dono ?? gs[0])?.cor ?? null;
  };

  const [grupoAtivo, setGrupoAtivo] = useState<string | null>(() => grupoInicial(grupos));

  const valor = useMemo<Escolha>(
    () => ({
      variacoes,
      corVariacao,
      trocarVariacao: (cor: string) => {
        setCorVariacao(cor);
        setGrupoAtivo(grupoInicial(gruposDeCor(produto, cor)));
      },
      grupos,
      grupoAtivo,
      setGrupoAtivo,
      rotulo: rotuloSelecao(variacoes, grupos),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [produto, variacoes, corVariacao, grupos, grupoAtivo]
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
