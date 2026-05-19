export type TipoMovimento = 'ENTRADA' | 'SAIDA';

export interface MovimentoEstoque {
  id_movimento: number;
  id_produto: number;
  id_usuario: number;
  id_item: number | null;
  tipo: TipoMovimento;
  quantidade: number;
  data_movimento: string;
}

export interface EntradaCriarMovimento {
  id_produto: number;
  id_usuario: number;
  id_item?: number;
  tipo: TipoMovimento;
  quantidade: number;
}