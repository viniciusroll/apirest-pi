import { z } from 'zod';

export const criarPedidoSchema = z.object({
  id_cliente: z.number().int().positive('id_cliente inválido'),
  forma_pagamento: z.enum(['DINHEIRO', 'CARTAO', 'PIX', 'FIADO']),
  itens: z.array(
    z.object({
      id_produto: z.number().int().positive('id_produto inválido'),
      quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
    })
  ).min(1, 'O pedido deve ter ao menos um item'),
});

export const atualizarPedidoSchema = z.object({
  status: z.enum(['PENDENTE', 'PAGO', 'CANCELADO']).optional(),
  forma_pagamento: z.enum(['DINHEIRO', 'CARTAO', 'PIX', 'FIADO']).optional(),
}).refine((data) => data.status !== undefined || data.forma_pagamento !== undefined, {
  message: 'Informe ao menos um campo para atualizar: status ou forma_pagamento',
});