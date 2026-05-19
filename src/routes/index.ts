import { Router } from "express";

import clienteRouter from "./cliente.route";
import fornecedorRouter from "./fornecedor.route";
import pedidoRouter from "./pedido.route";
import produtoRouter from "./produto.route";
import movimentoEstoqueRouter from "./movimento-estoque.route";
import relatorioRouter from "./relatorio.route";
import authRouter from "./auth.route";

const router = Router();

// Autenticação (pública — sem JWT)
router.use("/auth", authRouter);

// Recursos principais
router.use("/clientes", clienteRouter);
router.use("/fornecedores", fornecedorRouter);
router.use("/pedidos", pedidoRouter);
router.use("/produtos", produtoRouter);
router.use("/movimentos-estoque", movimentoEstoqueRouter);

// Relatórios
router.use("/relatorios", relatorioRouter);

export default router;