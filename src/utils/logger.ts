const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  info: (msg: string, data?: unknown) => {
    if (!isProduction) console.log(`[INFO] ${new Date().toISOString()} — ${msg}`, data ?? "");
  },
  error: (msg: string, err?: unknown) => {
    console.error(`[ERRO] ${new Date().toISOString()} — ${msg}`, err ?? "");
  },
  warn: (msg: string) => {
    console.warn(`[AVISO] ${new Date().toISOString()} — ${msg}`);
  },
};