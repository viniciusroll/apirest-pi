import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { RequestAutenticado } from "../types";

export function authMiddleware(req: RequestAutenticado, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id_usuario: number;
      email: string;
      papel: string;
    };

    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

/** Middleware que só permite acesso a usuários com papel ADMIN */
export function apenasAdmin(req: RequestAutenticado, res: Response, next: NextFunction) {
  if (req.usuario?.papel !== "ADMIN") {
    return res.status(403).json({ erro: "Acesso restrito a administradores" });
  }
  next();
}