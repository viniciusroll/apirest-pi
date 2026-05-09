import { Request, Response } from "express";
import * as service from "../services/fornecedor.service"
import { criarFornecedorSchema, atualizarFornecedorSchema } from "../schemas/fornecedor.schema"


export async function criarFornecedor(req: Request, res: Response) {
    try {
        const dados = criarFornecedorSchema.parse(req.body);
        const fornecedor = await service.criarFornecedor(dados);
        res.status(201).json(fornecedor);
    } catch (err: any) {
        res.status(400).json({ erro: err.message });
    }
}

export async function listarFornecedores(req: Request, res: Response) {
    const fornecedores = await service.listarFornecedores();
    res.json(fornecedores);
}