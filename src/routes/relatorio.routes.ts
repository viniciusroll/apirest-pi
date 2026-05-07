import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Relatórios
 *   description: Relatórios do sistema
 */

/**
 * @swagger
 * /relatorios/clientes-devedores:
 *   get:
 *     summary: Lista clientes com pedidos FIADO em aberto
 *     tags: [Relatórios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes devedores retornada com sucesso
 */
router.get("/clientes-devedores", (req, res) => {
  res.json({ message: "Relatório em desenvolvimento" });
});

export default router;