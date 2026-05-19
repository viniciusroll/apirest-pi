// ============================================================================
// fornecedor.controller.ts — camada HTTP da entidade Fornecedor
// ============================================================================
// Responsabilidades:
//   1. Receber a Request do Express
//   2. Validar o body/params com schema Zod
//   3. Chamar o service com dados validados
//   4. Devolver resposta JSON com status HTTP correto
//   5. Encaminhar erros via next(err) — middleware central trata
//
// O controller NAO acessa banco diretamente. NAO tem regra de negocio.
// E uma camada FINA — cola entre o Express e o service. Igual ao
// produto.controller.
// ============================================================================

import { Request, Response, NextFunction } from "express";
import { fornecedorService } from "../services/fornecedor.service";
import {
  criarFornecedorSchema,
  atualizarFornecedorSchema,
} from "../schemas/fornecedor.schema";

export const fornecedorController = {
  // --------------------------------------------------------------------------
  // GET /fornecedores — lista todos os fornecedores
  // --------------------------------------------------------------------------
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const fornecedores = await fornecedorService.listar();
      res.json(fornecedores);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // GET /fornecedores/:id — busca fornecedor por id
  // --------------------------------------------------------------------------
  // Number(req.params.id) converte o id (sempre string na URL) em numero.
  // Se vier "/fornecedores/abc", o Number vira NaN e o service joga 404
  // quando nao achar — fluxo coberto.
  // --------------------------------------------------------------------------
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const fornecedor = await fornecedorService.buscarPorId(id);
      res.json(fornecedor);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // POST /fornecedores — cria novo fornecedor
  // --------------------------------------------------------------------------
  // criarFornecedorSchema.parse(req.body) valida nome, cnpj (14 digitos),
  // endereco, tempo_entrega e os arrays emails/telefones. Lanca ZodError
  // se algo estiver invalido — capturado pelo catch e tratado pelo
  // middleware. 201 = Created.
  // --------------------------------------------------------------------------
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarFornecedorSchema.parse(req.body);
      const fornecedor = await fornecedorService.criar(dados);
      res.status(201).json(fornecedor);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // PUT /fornecedores/:id — atualiza fornecedor existente
  // --------------------------------------------------------------------------
  // atualizarFornecedorSchema = criarFornecedorSchema.partial(), entao
  // todos os campos sao opcionais (ex.: mandar so { tempo_entrega: 5 }).
  // --------------------------------------------------------------------------
  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dados = atualizarFornecedorSchema.parse(req.body);
      const fornecedor = await fornecedorService.atualizar(id, dados);
      res.json(fornecedor);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // DELETE /fornecedores/:id — remove fornecedor
  // --------------------------------------------------------------------------
  // 204 No Content — padrao REST para DELETE bem-sucedido (sem body).
  // --------------------------------------------------------------------------
  async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await fornecedorService.remover(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
