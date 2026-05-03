// ============================================================================
// produto.controller.ts — camada HTTP da entidade Produto
// ============================================================================
// Responsabilidades:
//   1. Receber a Request do Express
//   2. Validar o body/params com schema Zod
//   3. Chamar o service com dados validados
//   4. Devolver resposta JSON com status HTTP correto
//   5. Encaminhar erros via next(err) — middleware central trata
//
// O controller NAO acessa banco diretamente. NAO tem regra de negocio.
// E uma camada FINA — uma cola entre o Express e o service.
//
// Padrao try/catch + next(err):
//   Todo erro lancado por validacao Zod ou pelo service e' capturado
//   no catch e passado pro middleware de erro central. O controller
//   NUNCA chama res.status(500) diretamente.
// ============================================================================

import { Request, Response, NextFunction } from "express";
import { produtoService } from "../services/produto.service";
import {
  criarProdutoSchema,
  atualizarProdutoSchema,
} from "../schemas/produto.schema";

export const produtoController = {
  // --------------------------------------------------------------------------
  // GET /produtos — lista todos os produtos
  // --------------------------------------------------------------------------
  // Underline em '_req' indica que nao usamos esse parametro (nao tem
  // body/params/query a processar nessa rota).
  // --------------------------------------------------------------------------
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const produtos = await produtoService.listar();
      res.json(produtos);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // GET /produtos/:id — busca produto por id
  // --------------------------------------------------------------------------
  // Number(req.params.id) converte o id (que sempre vem como string na URL)
  // em numero. Se o usuario mandar "/produtos/abc", o Number retorna NaN
  // e o service vai jogar 404 quando nao achar — fluxo coberto.
  // --------------------------------------------------------------------------
  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.buscarPorId(id);
      res.json(produto);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // POST /produtos — cria novo produto
  // --------------------------------------------------------------------------
  // 'criarProdutoSchema.parse(req.body)' faz duas coisas:
  //   1. Valida os campos (nome com min 2 chars, preco > 0, etc.)
  //   2. Lanca ZodError automaticamente se algo estiver invalido
  //      — capturado pelo catch e tratado pelo middleware
  //
  // res.status(201) = "Created" — padrao REST para POST que cria recurso.
  // --------------------------------------------------------------------------
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const dados = criarProdutoSchema.parse(req.body);
      const produto = await produtoService.criar(dados);
      res.status(201).json(produto);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // PUT /produtos/:id — atualiza produto existente
  // --------------------------------------------------------------------------
  // atualizarProdutoSchema = criarProdutoSchema.partial(), entao todos
  // os campos sao opcionais. Cliente pode mandar so { preco: 12.5 }.
  // --------------------------------------------------------------------------
  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const dados = atualizarProdutoSchema.parse(req.body);
      const produto = await produtoService.atualizar(id, dados);
      res.json(produto);
    } catch (err) {
      next(err);
    }
  },

  // --------------------------------------------------------------------------
  // DELETE /produtos/:id — remove produto
  // --------------------------------------------------------------------------
  // res.status(204).send() = "No Content" — padrao REST para DELETE
  // bem-sucedido. Nao retornamos body, so o status 204.
  // --------------------------------------------------------------------------
  async remover(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await produtoService.remover(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};