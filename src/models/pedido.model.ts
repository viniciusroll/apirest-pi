export interface Pedido {
    id_pedido: number;
    id_cliente: number;
    data: string;
    pagamento: number;
    criado_em: string;
}

export interface ItemPedido {
    id_pedido: number;
    id_produto: number;
    quantidade: number;
}