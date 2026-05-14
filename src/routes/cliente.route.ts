import { Router } from "express";
import * as controller from "../controllers/cliente.controller";
import { listarPedidosPorCliente } from "../controllers/pedido.controller";

const router = Router();

router.get("/", controller.listarClientes);
router.get("/:id", controller.buscarClientePorId);
router.post("/", controller.criarCliente);
router.put("/:id", controller.atualizarCliente);
router.delete("/:id", controller.excluirCliente);

// RF06 / RN05 — histórico de pedidos de um cliente específico
router.get("/:id/pedidos", listarPedidosPorCliente);

export default router;