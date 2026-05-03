export interface Produto {
    id_produto: number;
    nome: string;
    preco: number;
    estoque: number;
    validade: string | null;
    categoria: string | null;
    id_fornecedor: number | null;
    criado_em: string;
    atualizado_em: string;
}


export type EntradaCriarProduto = Omit<Produto, "id_produto" | "criado_em" | "atualizado_em">;
export type EntradaAtualizarProduto = Partial<EntradaCriarProduto>;