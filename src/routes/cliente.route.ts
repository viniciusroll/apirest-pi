import { Router } from "express";
import * as controller from "../controllers/cliente.controller";

const router = Router();

router.post("/", controller.criarCliente);
router.get("/", controller.listarClientes);
router.get("/:id", controller.buscarClientePorId);
router.put("/:id", controller.atualizarCliente);
router.delete("/:id", controller.excluirCliente);

export default router;
