import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { loginSchema, criarUsuarioSchema } from "../schemas/usuario.schema";
import { RequestAutenticado } from "../types";
import { z } from "zod";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = loginSchema.parse(req.body);
      const resultado = await authService.login(email, senha);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  },

  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarUsuarioSchema.parse(req.body);
      const usuario = await authService.registrar(dados.nome, dados.email, dados.senha, dados.papel);
      res.status(201).json(usuario);
    } catch (err) {
      next(err);
    }
  },

  async alterarSenha(req: RequestAutenticado, res: Response, next: NextFunction) {
    try {
      const { senha_atual, nova_senha } = z.object({
        senha_atual: z.string().min(1),
        nova_senha: z.string().min(6, 'Nova senha deve ter ao menos 6 caracteres'),
      }).parse(req.body);

      await authService.alterarSenha(req.usuario!.id_usuario, senha_atual, nova_senha);
      res.json({ mensagem: 'Senha alterada com sucesso' });
    } catch (err) {
      next(err);
    }
  },
};