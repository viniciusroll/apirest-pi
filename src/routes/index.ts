//Adiciona todas as rotas do projeto    
import { Router } from "express";

import clienteRouter from "./cliente.route";
import fornecedorRouter from "./fornecedor.route";
import pedidoRouter from "./pedido.route";
import produtoRouter from "./produto.route";

const router = Router();
router.use("/clientes", clienteRouter);
router.use("/fornecedores", fornecedorRouter);
router.use("/pedidos", pedidoRouter);
router.use("/produtos", produtoRouter);

export default router;
