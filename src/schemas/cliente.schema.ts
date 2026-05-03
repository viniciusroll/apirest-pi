import { z } from 'zod';

export const criarClienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').trim(),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter exatamente 11 dígitos'),
  endereco: z.string().min(5, 'Endereço deve ter ao menos 5 caracteres').trim(),
  emails: z.array(z.string().email('E-mail inválido')).min(1, 'Informe ao menos um e-mail'),
  telefones: z.array(z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos')).min(1, 'Informe ao menos um telefone'),
});

export const atualizarClienteSchema = criarClienteSchema.partial();