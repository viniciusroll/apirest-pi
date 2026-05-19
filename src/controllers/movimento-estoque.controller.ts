import { Response, NextFunction } from "express";
import * as service from "../services/movimento-estoque.service";
import { criarMovimentoEstoqueSchema } from "../schemas/movimento-estoque.schema";
import { RequestAutenticado } from "../types";

export async function criarMovimento(req: RequestAutenticado, res: Response, next: NextFunction) {
  try {
    const dados = criarMovimentoEstoqueSchema.parse(req.body);
    const movimento = await service.criarMovimento({
      ...dados,
      id_usuario: req.usuario!.id_usuario,
    });
    res.status(201).json(movimento);
  } catch (err) {
    next(err);
  }
}

export async function listarPorProduto(req: RequestAutenticado, res: Response, next: NextFunction) {
  try {
    const id_produto = Number(req.params.id_produto);
    const movimentos = await service.listarMovimentosPorProduto(id_produto);
    res.json(movimentos);
  } catch (err) {
    next(err);
  }
}

export async function listarTodos(req: RequestAutenticado, res: Response, next: NextFunction) {
  try {
    const movimentos = await service.listarTodosMovimentos();
    res.json(movimentos);
  } catch (err) {
    next(err);
  }
}