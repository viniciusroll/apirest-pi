// ============================================================================
// fornecedor.routes.ts — definicao das rotas da entidade Fornecedor
// ============================================================================
// O Router do Express agrupa as rotas relacionadas. Em app.ts montamos
// isso sob um prefixo:
//
//   app.use("/fornecedores", fornecedorRoutes)
//
// Resultado:
//   GET    /fornecedores       -> fornecedorController.listar
//   GET    /fornecedores/:id   -> fornecedorController.buscarPorId
//   POST   /fornecedores       -> fornecedorController.criar
//   PUT    /fornecedores/:id   -> fornecedorController.atualizar
//   DELETE /fornecedores/:id   -> fornecedorController.remover
//
// Esse arquivo NAO sabe qual prefixo sera usado — fica desacoplado.
// Mesmo padrao do produto.routes.
// ============================================================================

import { Router } from "express";
import { fornecedorController } from "../controllers/fornecedor.controller";

const router = Router();

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
router.get("/", fornecedorController.listar);
router.get("/:id", fornecedorController.buscarPorId);
router.post("/", fornecedorController.criar);
router.put("/:id", fornecedorController.atualizar);
router.delete("/:id", fornecedorController.remover);

// 'export default' permite o app.ts importar com qualquer nome:
//   import fornecedorRoutes from "./routes/fornecedor.routes";
export default router;
