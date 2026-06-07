import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// POST /auth/login — recebe email + senha, retorna token JWT
router.post("/login", authController.login);

// POST /auth/registrar — cria novo usuário (admin cria outros funcionários)
router.post("/registrar", authController.registrar);

// POST /auth/alterar-senha — troca a senha do usuario autenticado
router.post("/alterar-senha", authMiddleware, authController.alterarSenha);

export default router;