import { relatorioRepository } from "../repositories/relatorio.repository";
import { AppError } from "../errors/app-error";
import { isDataValida } from "../utils/helpers";

export const relatorioService = {
  async clientesInadimplentes() {
    const dados = await relatorioRepository.clientesInadimplentes();
    return {
      total_clientes_inadimplentes: dados.length,
      clientes: dados,
    };
  },

  async vendasPorPeriodo(inicio: string, fim: string) {
    if (!isDataValida(inicio) || !isDataValida(fim)) {
      throw new AppError("Datas inválidas. Use o formato YYYY-MM-DD", 400);
    }
    if (inicio > fim) {
      throw new AppError("A data de início não pode ser posterior à data de fim", 400);
    }
    const dados = await relatorioRepository.vendasPorPeriodo(inicio, fim);
    return { periodo: { inicio, fim }, ...dados };
  },

  async produtosMaisVendidos(limite: number = 10) {
    const dados = await relatorioRepository.produtosMaisVendidos(limite);
    return { top: limite, produtos: dados };
  },

  async estoqueBaixo(limite: number = 10) {
    const dados = await relatorioRepository.estoqueBaixo(limite);
    return {
      limite_alerta: limite,
      total_produtos_criticos: dados.length,
      produtos: dados,
    };
  },
};