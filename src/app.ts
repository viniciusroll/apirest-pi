// ============================================================================
// app.ts — setup do Express
// ============================================================================
// Todas as rotas sao agregadas em src/routes/index.ts.
// O middleware central de erros (ZodError -> 400, AppError -> statusCode,
// resto -> 500) fica em src/middleware/error.middleware.ts.
// ============================================================================

import express from "express";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Serve arquivos estáticos da pasta frontend/
app.use(express.static(path.resolve(__dirname, "../frontend")));

// Habilita parse de JSON no body das requests
app.use(express.json());

// Habilita CORS para qualquer origem (desenvolvimento)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// --------------------------------------------------------------------------
// Rotas
// --------------------------------------------------------------------------
app.use(routes);

// --------------------------------------------------------------------------
// Middleware central de erros
// --------------------------------------------------------------------------
app.use(errorHandler);

export default app;