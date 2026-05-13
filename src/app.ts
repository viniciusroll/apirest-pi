import express from "express";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

// --------------------------------------------------------------------------
// Rotas (agregador)
// --------------------------------------------------------------------------
app.use(routes);

// --------------------------------------------------------------------------
// Middleware central de erros
// --------------------------------------------------------------------------
app.use(errorHandler);

export default app;
