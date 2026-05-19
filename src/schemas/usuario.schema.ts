import { z } from 'zod';

export const criarUsuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres').trim(),
  email: z.string().email('E-mail inválido').max(150, 'E-mail deve ter no máximo 150 caracteres'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  papel: z.enum(['FUNCIONARIO', 'ADMIN']).optional().default('FUNCIONARIO'),
});

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').max(150, 'E-mail deve ter no máximo 150 caracteres'),
  senha: z.string().min(1, 'Senha obrigatória'),
});