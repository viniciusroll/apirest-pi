export type FormaPagamento = "DINHEIRO" | "CARTAO" | "PIX" | "FIADO";
export type StatusPedido = "PENDENTE" | "PAGO" | "CANCELADO";

export interface Pedido {
    id_pedido: number;
    id_cliente: number;
    id_usuario: number;
    forma_pagamento: FormaPagamento;
    status: StatusPedido;
    total_pedido: number;
    criado_em: string;
    atualizado_em: string;
}

export interface ItemPedido {
    id_item: number;
    id_pedido: number;
    id_produto: number;
    quantidade: number;
    subtotal: number;
}

export interface PedidoComItens extends Pedido {
  itens: ItemPedido[];
}

export interface EntradaCriarPedido {
  id_cliente: number;
  id_usuario: number;
  forma_pagamento: FormaPagamento;
  status?: StatusPedido;
  itens: Array<{ id_produto: number; quantidade: number; preco_unitario?: number }>;
}