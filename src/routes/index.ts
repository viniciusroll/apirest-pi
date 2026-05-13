//Adiciona todas as rotas do projeto    
import { Router } from "express";

import clienteRouter from "./cliente.routes";
import fornecedorRouter from "./fornecedor.routes";
import pedidoRouter from "./pedido.routes";
import produtoRouter from "./produto.routes";

const router = Router();
router.use("/clientes", clienteRouter);
router.use("/fornecedores", fornecedorRouter);
router.use("/pedidos", pedidoRouter);
router.use("/produtos", produtoRouter);

export default router;
