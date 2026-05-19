import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

// POST /auth/login — recebe email + senha, retorna token JWT
router.post("/login", authController.login);

// POST /auth/registrar — cria novo usuário (admin cria outros funcionários)
router.post("/registrar", authController.registrar);

export default router;