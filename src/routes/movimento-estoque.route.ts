import { Router } from "express";
import * as controller from "../controllers/movimento-estoque.controller";

const router = Router();

router.post("/", controller.criarMovimento);
router.get("/", controller.listarTodos);
router.get("/produto/:id_produto", controller.listarPorProduto);

export default router;