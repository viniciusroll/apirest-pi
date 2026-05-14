import { Router } from "express";
import * as controller from "../controllers/movimento-estoque.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, controller.criarMovimento);
router.get("/", authMiddleware, controller.listarTodos);
router.get("/produto/:id_produto", authMiddleware, controller.listarPorProduto);

export default router;