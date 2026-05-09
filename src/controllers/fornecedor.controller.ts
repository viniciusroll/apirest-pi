import { Request, Response } from "express";
import * as service from "../services/fornecedor.service"
import { criarFornecedorSchema, atualizarFornecedorSchema } from "../schemas/fornecedor.schema"
import { number } from "zod/v4";


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

export async function buscarFornecedorPorID(req: Request, res: Response) {
    const fornecedor = await service.buscarFornecedorPorID(Number(req.params.id));
    if (!fornecedor) return res.status(404).json({ erro: "Fornecedor não encontrado!" });
    res.json(fornecedor);
}

export async function atualizarFornecedor(req: Request, res: Response) {
    try {
        const dados = atualizarFornecedorSchema.parse(req.body);
        const fornecedor = await service.atualizarFornecedor(Number(req.params.id), dados);
        res.json(fornecedor);
    } catch(err: any) {
        res.status(400).json({ erro: err.message });
    }
}

export async function excluirFornecedor(req: Request, res: Response) {
    const ok = await service.excluirFornecedor(Number(req.params.id));
    if (!ok) return res.status(404).json({ erro: "Fornecedor não encontrado!" });
    res.json({ mensagem: "Fornecedor excluído com sucesso" });
}