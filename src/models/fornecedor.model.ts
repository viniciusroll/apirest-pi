export interface Fornecedor {
  id_fornecedor: number;
  nome: string;
  cnpj: string;
  endereco: string | null;
  tempo_entrega: number | null;
  criado_em: string;
  atualizado_em: string;
}

export interface EmailFornecedor {
  id: number;
  id_fornecedor: number;
  email: string;
}

export interface TelefoneFornecedor {
  id: number;
  id_fornecedor: number;
  telefone: string;
}

export interface FornecedorCompleto extends Fornecedor {
  emails: string[];
  telefones: string[];
}

export type EntradaCriarFornecedor = Omit<Fornecedor, "id_fornecedor" | "criado_em" | "atualizado_em">;
export type EntradaAtualizarFornecedor = Partial<EntradaCriarFornecedor>;