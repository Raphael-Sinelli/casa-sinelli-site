export interface Variacao {
  cor: string;
  imagens: string[];
}

export interface Produto {
  id: string;
  nome: string;
  nomePasta: string;
  marca: string;
  categoria: string;
  caminho: string;
  subpastas: string[];
  medidas: string | null;
  medidasRodape?: string;
  descricao?: string;
  informacoes: string | null;
  linkReferencia: string | null;
  coresEstruturadas?: string[];
  capa?: string | null;
  imagens: string[];
  variacoes: Variacao[];
  todasImagens: string[];
}

// DTO enxuto para listagens (catálogo, categoria, seleção da home) — o client
// recebe só o necessário para o card, com a capa já resolvida em URL.
export interface ProdutoResumo {
  id: string;
  nome: string;
  categoria: string;
  capaUrl: string | null;
}

export type Categoria = string;
