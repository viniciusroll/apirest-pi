import { Request, Response, NextFunction } from "express";
import { relatorioService } from "../services/relatorio.service";

export const relatorioController = {
  async inadimplentes(_req: Request, res: Response, next: NextFunction) {
    try {
      const dados = await relatorioService.clientesInadimplentes();
      res.json(dados);
    } catch (err) {
      next(err);
    }
  },

  async vendasPorPeriodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { inicio, fim } = req.query as { inicio: string; fim: string };
      if (!inicio || !fim) {
        return res.status(400).json({ erro: "Parâmetros obrigatórios: inicio e fim (YYYY-MM-DD)" });
      }
      const dados = await relatorioService.vendasPorPeriodo(inicio, fim);
      res.json(dados);
    } catch (err) {
      next(err);
    }
  },

  async produtosMaisVendidos(req: Request, res: Response, next: NextFunction) {
    try {
      const limite = req.query.limite ? Number(req.query.limite) : 10;
      const dados = await relatorioService.produtosMaisVendidos(limite);
      res.json(dados);
    } catch (err) {
      next(err);
    }
  },

  async estoqueBaixo(req: Request, res: Response, next: NextFunction) {
    try {
      const limite = req.query.limite ? Number(req.query.limite) : 10;
      const dados = await relatorioService.estoqueBaixo(limite);
      res.json(dados);
    } catch (err) {
      next(err);
    }
  },
};