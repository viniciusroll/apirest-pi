import { z } from 'zod';

export const criarProdutoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres').trim(),
  estoque: z.number().int().nonnegative('Estoque não pode ser negativo'),
  validade: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Validade deve estar no formato YYYY-MM-DD'),
  preco: z.number().positive('Preço deve ser maior que zero'),
  categoria: z.enum(['CERVEJA', 'REFRIGERANTE', 'DESTILADO', 'VINHO', 'AGUA', 'ENERGETICO', 'OUTRO']),
  id_fornecedor: z.number().int().positive('id_fornecedor inválido'),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial();