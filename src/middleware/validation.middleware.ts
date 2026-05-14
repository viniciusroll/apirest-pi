import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Retorna um middleware que valida req.body com o schema fornecido.
 * Se inválido, retorna 400 com os erros de campo detalhados.
 * Se válido, substitui req.body pelos dados parseados (já tipados e limpos).
 *
 * Uso nas rotas:
 *   router.post("/", validar(criarProdutoSchema), produtoController.criar)
 */
export function validar(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          erro: "Dados inválidos",
          detalhes: err.flatten().fieldErrors,
        });
      }
      next(err);
    }
  };
}