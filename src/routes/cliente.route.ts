import { Router } from "express";
import * as controller from "../controllers/cliente.controller";
import * as pedidoController from "../controllers/pedido.controller";

const router = Router();

router.post("/", controller.criarCliente);
router.get("/", controller.listarClientes);
router.get("/:id", controller.buscarClientePorId);
router.get("/:id/pedidos", pedidoController.listarPedidosPorCliente);
router.put("/:id", controller.atualizarCliente);
router.delete("/:id", controller.excluirCliente);

export default router;
