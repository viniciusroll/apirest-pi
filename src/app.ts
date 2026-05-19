// ============================================================================
// app.ts — setup do Express
// ============================================================================
// Todas as rotas sao agregadas em src/routes/index.ts.
// O middleware central de erros (ZodError -> 400, AppError -> statusCode,
// resto -> 500) fica em src/middleware/error.middleware.ts.
// ============================================================================

import express from "express";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Habilita parse de JSON no body das requests
app.use(express.json());

// --------------------------------------------------------------------------
// Rotas
// --------------------------------------------------------------------------
app.use(routes);

// --------------------------------------------------------------------------
// Middleware central de erros
// --------------------------------------------------------------------------
app.use(errorHandler);

export default app;
