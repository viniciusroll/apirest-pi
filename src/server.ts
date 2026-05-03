// ============================================================================
// server.ts — entrypoint do servidor (versao MINIMA, provisoria)
// ============================================================================
// Sobe o Express na porta definida no .env.
// Versao final sera melhorada pela Pessoa 2.
// ============================================================================

import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`✓ Servidor rodando em http://localhost:${PORT}`);
  console.log(`  Rotas disponiveis: GET POST PUT DELETE /produtos`);
});