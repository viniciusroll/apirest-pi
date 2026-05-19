import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { loginSchema, criarUsuarioSchema } from "../schemas/usuario.schema";

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
};