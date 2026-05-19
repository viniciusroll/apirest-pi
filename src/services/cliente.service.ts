import { clienteRepository as repo } from "../repositories/cliente.repository";
import {
  EntradaCriarCliente,
  EntradaAtualizarCliente,
  ClienteCompleto,
} from "../models/cliente.model";
import { AppError } from "../errors/app-error";

export async function criarCliente(
  dados: EntradaCriarCliente & { emails: string[]; telefones: string[] }
): Promise<ClienteCompleto> {
  // RN03: cliente deve ter CPF único
  const existente = await repo.findByCpf(dados.cpf);
  if (existente) {
    throw new AppError("Já existe cliente com esse CPF", 409);
  }

  return repo.create(dados, dados.emails, dados.telefones);
}

export async function listarClientes() {
  return repo.findAll();
}

export async function buscarClientePorId(id: number) {
  return repo.findCompletoById(id);
}

export async function atualizarCliente(id: number, dados: EntradaAtualizarCliente) {
  return repo.update(id, dados);
}

export async function excluirCliente(id: number) {
  return repo.delete(id);
}
