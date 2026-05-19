import { z } from 'zod';

export const criarMovimentoEstoqueSchema = z.object({
  id_produto: z.number().int().positive('id_produto inválido'),
  tipo: z.enum(['ENTRADA', 'SAIDA']),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
  id_item: z.number().int().positive('id_item inválido').optional(),
});