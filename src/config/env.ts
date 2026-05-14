import "dotenv/config";

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-dev-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

if (!process.env.JWT_SECRET) {
  console.warn("⚠ JWT_SECRET não definido no .env — usando valor de fallback (não use em produção)");
}