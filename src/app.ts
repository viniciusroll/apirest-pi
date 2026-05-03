// ============================================================================
// app.ts — setup do Express (versao MINIMA, provisoria)
// ============================================================================
// ATENCAO: este arquivo e' uma versao MINIMA criada pra permitir testar
// as rotas do modulo Produto via Postman/Insomnia.
//
// A versao final (com todas as rotas, middleware de validacao centralizada,
// CORS, autenticacao, etc.) sera feita pela Pessoa 2 — Nucleo da Aplicacao.
// Quando ela mexer, este arquivo vai ser SOBRESCRITO.
// ============================================================================

import express, { Request, Response, NextFunction } from "express";
import produtoRoutes from "./routes/produto.routes";
import { ZodError } from "zod";
import { AppError } from "./errors/app-error";

const app = express();

// Habilita parse de JSON no body das requests
app.use(express.json());

// --------------------------------------------------------------------------
// Rotas
// --------------------------------------------------------------------------
// Por enquanto so registramos /produtos. Outras rotas (clientes, pedidos,
// usuario, fornecedor, relatorios) entrarao quando seus modulos ficarem
// prontos.
// --------------------------------------------------------------------------
app.use("/produtos", produtoRoutes);

// --------------------------------------------------------------------------
// Middleware central de erros
// --------------------------------------------------------------------------
// Toda funcao do controller usa next(err) — esse middleware captura.
// Tipa cada tipo de erro e devolve resposta JSON apropriada.
// --------------------------------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Erro de validacao Zod -> 400 com detalhes dos campos invalidos
  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: "Dados invalidos",
      detalhes: err.flatten().fieldErrors,
    });
  }

  // Erro de dominio (lancado pelo service via AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  // Qualquer outro erro -> 500 (esconde detalhes do cliente)
  console.error("Erro nao tratado:", err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
});

export default app;