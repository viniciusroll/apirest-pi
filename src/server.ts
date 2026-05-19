import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { logger } from "./utils/logger";

app.listen(env.PORT, () => {
  logger.info(`Servidor rodando em http://localhost:${env.PORT}`);
  logger.info("Rotas disponíveis: /produtos /clientes /pedidos /fornecedores /auth /relatorios");
});