export interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  endereco: string | null;
  criado_em: string;
}

export interface EmailCliente {
  id: number;
  id_cliente: number;
  email: string;
}

export interface TelefoneCliente {
  id: number;
  id_cliente: number;
  telefone: string;
}

export interface ClienteCompleto extends Cliente {
  emails: string[];
  telefones: string[];
}

export type EntradaCriarCliente = Omit<Cliente, "id_cliente" | "criado_em">;
export type EntradaAtualizarCliente = Partial<EntradaCriarCliente>;