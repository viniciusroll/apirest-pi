import { Router } from "express";
import { relatorioController } from "../controllers/relatorio.controller";

const router = Router();

// GET /relatorios/inadimplentes
// Retorna clientes com pedidos FIADO + PENDENTE e o valor em aberto
router.get("/inadimplentes", relatorioController.inadimplentes);

// GET /relatorios/vendas?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
// Total de pedidos e receita no período informado
router.get("/vendas", relatorioController.vendasPorPeriodo);

// GET /relatorios/produtos-mais-vendidos?limite=10
// Ranking dos produtos mais vendidos por quantidade
router.get("/produtos-mais-vendidos", relatorioController.produtosMaisVendidos);

// GET /relatorios/estoque-baixo?limite=10
// Produtos com estoque abaixo do limite informado
router.get("/estoque-baixo", relatorioController.estoqueBaixo);

export default router;