import { Router } from "express";
import * as controller from "../controllers/pedido.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, controller.criarPedido);
router.get("/:id", controller.buscarPedidoPorId);
router.put("/:id", controller.atualizarPedido);
router.delete("/:id", controller.excluirPedido);

export default router;