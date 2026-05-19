import { authMiddleware } from "../middleware/auth.middleware";
import { Router } from "express";
import * as controller from "../controllers/fornecedor.controller";


const router = Router();

router.use(authMiddleware);

router.post("/", controller.criarFornecedor);
router.get("/", controller.listarFornecedores);
router.get("/:id", controller.buscarFornecedorPorID);
router.put("/:id", controller.atualizarFornecedor);
router.delete("/:id", controller.excluirFornecedor);

export default router;
