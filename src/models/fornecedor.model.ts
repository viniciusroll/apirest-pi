export interface Fornecedor {
  id_fornecedor: number;
  nome: string;
  cnpj: string;
  endereco: string | null;
  tempo_entrega: number | null;
  criado_em: string;
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

// Entrada de criacao: dados do fornecedor + os contatos multivalorados.
// emails/telefones nao ficam na tabela 'fornecedor' (vao para
// email_fornecedor / telefone_fornecedor), mas chegam juntos no body
// da request, entao fazem parte do input do service/repository.
export type EntradaCriarFornecedor = Omit<
  Fornecedor,
  "id_fornecedor" | "criado_em"
> & {
  emails: string[];
  telefones: string[];
};

export type EntradaAtualizarFornecedor = Partial<EntradaCriarFornecedor>;