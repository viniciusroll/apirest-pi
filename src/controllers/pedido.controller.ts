import { Request, Response, NextFunction } from "express";
import * as service from "../services/pedido.service";
import { criarPedidoSchema, atualizarPedidoSchema } from "../schemas/pedido.schema";

export async function criarPedido(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = criarPedidoSchema.parse(req.body);
    const pedido = await service.criarPedido(dados);
    res.status(201).json(pedido);
  } catch (err) {
    next(err);
  }
}

export async function buscarPedidoPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const pedido = await service.buscarPedidoPorId(id);
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}

export async function atualizarPedido(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const dados = atualizarPedidoSchema.parse(req.body);
    const pedido = await service.atualizarPedido(id, dados.status, dados.forma_pagamento);
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}

export async function excluirPedido(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const ok = await service.excluirPedido(id);
    res.json({ sucesso: ok });
  } catch (err) {
    next(err);
  }
}
