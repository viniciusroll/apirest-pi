/** Formata um valor numérico como moeda brasileira (ex: R$ 12,50) */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Retorna a data atual no formato YYYY-MM-DD */
export function dataHoje(): string {
  return new Date().toISOString().split("T")[0];
}

/** Verifica se uma string está no formato de data YYYY-MM-DD */
export function isDataValida(data: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(data) && !isNaN(Date.parse(data));
}