import { authMiddleware } from "../middleware/auth.middleware";
// ============================================================================
// produto.routes.ts — definicao das rotas da entidade Produto
// ============================================================================
// O Router do Express e' uma "mini-aplicacao" que agrupa rotas relacionadas.
// Vantagem: podemos registrar tudo aqui (5 rotas) e em outro arquivo
// (app.ts) montar isso sob um prefixo:
//
//   app.use("/produtos", produtoRoutes)
//
// Resultado:
//   GET    /produtos       -> produtoController.listar
//   GET    /produtos/:id   -> produtoController.buscarPorId
//   POST   /produtos       -> produtoController.criar
//   PUT    /produtos/:id   -> produtoController.atualizar
//   DELETE /produtos/:id   -> produtoController.remover
//
// Esse arquivo NAO sabe qual prefixo sera usado — fica desacoplado.
// ============================================================================

import { Router } from "express";
import { produtoController } from "../controllers/produto.controller";

const router = Router();

router.use(authMiddleware);

// --------------------------------------------------------------------------
// Padrao REST das rotas:
//   GET    /          listar todos
//   GET    /:id       buscar um especifico
//   POST   /          criar novo
//   PUT    /:id       atualizar existente
//   DELETE /:id       remover
//
// O ':id' e' um parametro dinamico — chega no controller via req.params.id
// --------------------------------------------------------------------------
router.get("/", produtoController.listar);
router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);
router.put("/:id", produtoController.atualizar);
router.delete("/:id", produtoController.remover);

// 'export default' permite o app.ts importar com qualquer nome:
//   import produtoRoutes from "./routes/produto.routes";
export default router;