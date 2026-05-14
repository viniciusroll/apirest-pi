import { Request, Response, NextFunction } from "express";
import * as service from "../services/cliente.service";
import { criarClienteSchema, atualizarClienteSchema } from "../schemas/cliente.schema";

export async function criarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = criarClienteSchema.parse(req.body);
    const cliente = await service.criarCliente(dados);
    res.status(201).json(cliente);
  } catch (err) {
    next(err)
  }
}

export async function listarClientes(req: Request, res: Response) {
  const clientes = await service.listarClientes();
  res.json(clientes);
}

export async function buscarClientePorId(req: Request, res: Response) {
  const cliente = await service.buscarClientePorId(Number(req.params.id));
  if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
  res.json(cliente);
}

export async function atualizarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = atualizarClienteSchema.parse(req.body);
    const cliente = await service.atualizarCliente(Number(req.params.id), dados);
    res.json(cliente);
  } catch (err) {
    next(err)
  }
}

export async function excluirCliente(req: Request, res: Response) {
  const ok = await service.excluirCliente(Number(req.params.id));
  if (!ok) return res.status(404).json({ erro: "Cliente não encontrado" });
  res.json({ mensagem: "Cliente excluído com sucesso" });
}
