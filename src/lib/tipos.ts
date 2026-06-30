export interface Variacao {
  cor: string;
  imagens: string[];
}

export interface Produto {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  caminho: string;
  subpastas: string[];
  medidas: string | null;
  medidasRodape?: string;
  informacoes: string | null;
  linkReferencia: string | null;
  coresEstruturadas?: string[];
  capa?: string | null;
  imagens: string[];
  variacoes: Variacao[];
  todasImagens: string[];
}

export type Categoria = string;
