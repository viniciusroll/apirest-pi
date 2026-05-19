import { Request } from "express";

/** Extend do Request do Express para incluir o usuário autenticado */
export interface RequestAutenticado extends Request {
  usuario?: {
    id_usuario: number;
    email: string;
    papel: string;
  };
}