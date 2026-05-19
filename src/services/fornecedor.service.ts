// ============================================================================
// fornecedor.service.ts — regras de negocio da entidade Fornecedor
// ============================================================================
// Fica entre o controller (HTTP) e o repository (banco). Aqui ficam:
//
//   1. Conversao de "registro nao encontrado" em erro 404
//      - O repository devolve null. O service joga AppError.
//
//   2. Traducao de erros do banco em mensagens de negocio
//      - CNPJ ja cadastrado, email/telefone repetido -> 409 Conflict
//        com mensagem amigavel (em vez do erro cru do SQLite virar 500).
//
//   3. Garantir que o registro existe antes de atualizar/remover
//
// O service NAO conhece req/res/next. E' puro — recebe input, devolve
// dados ou lanca AppError. Mesmo padrao do produto.service.
// ============================================================================

import { fornecedorRepository } from "../repositories/fornecedor.repository";
import {
  EntradaCriarFornecedor,
  EntradaAtualizarFornecedor,
} from "../models/fornecedor.model";
import { AppError } from "../errors/app-error";

// ----------------------------------------------------------------------------
// O banco tem varios UNIQUE: fornecedor.cnpj, UNIQUE(id_fornecedor,email) e
// UNIQUE(id_fornecedor,telefone). Quando um deles e' violado, o sqlite3
// joga um Error com "UNIQUE constraint failed: <tabela>.<coluna>".
//
// Sem este tratamento, esse erro cru cairia no middleware e viraria um
// 500 generico. Aqui transformamos em 409 Conflict com mensagem clara.
//
// Retorno 'never': esta funcao SEMPRE lanca — ou um AppError 409 (caso
// conhecido), ou re-lanca o erro original (qualquer outra coisa, que o
// middleware trata como 500). Isso deixa o TypeScript saber que o bloco
// catch nunca "passa direto".
// ----------------------------------------------------------------------------
function traduzErroDeUnicidade(err: unknown): never {
  const msg = err instanceof Error ? err.message : "";

  if (msg.includes("UNIQUE constraint failed")) {
    if (msg.includes("fornecedor.cnpj")) {
      throw new AppError("Ja existe um fornecedor com esse CNPJ", 409);
    }
    if (msg.includes("email_fornecedor")) {
      throw new AppError("E-mail repetido para o mesmo fornecedor", 409);
    }
    if (msg.includes("telefone_fornecedor")) {
      throw new AppError("Telefone repetido para o mesmo fornecedor", 409);
    }
    throw new AppError("Registro duplicado", 409);
  }

  throw err;
}

export const fornecedorService = {
  // --------------------------------------------------------------------------
  // Lista todos os fornecedores (ja com emails e telefones)
  // --------------------------------------------------------------------------
  listar() {
    return fornecedorRepository.findAll();
  },

  // --------------------------------------------------------------------------
  // Busca por id — joga 404 se nao existir
  // --------------------------------------------------------------------------
  async buscarPorId(id: number) {
    const fornecedor = await fornecedorRepository.findById(id);
    if (!fornecedor) {
      throw new AppError("Fornecedor nao encontrado", 404);
    }
    return fornecedor;
  },

  // --------------------------------------------------------------------------
  // Cria um novo fornecedor
  // --------------------------------------------------------------------------
  // Validacao de formato (cnpj com 14 digitos, ao menos 1 email/telefone)
  // ja foi feita pelo schema Zod no controller. Aqui so tratamos o que o
  // Zod nao tem como saber: se o CNPJ ja existe no banco.
  // --------------------------------------------------------------------------
  async criar(input: EntradaCriarFornecedor) {
    try {
      return await fornecedorRepository.create(input);
    } catch (err) {
      traduzErroDeUnicidade(err);
    }
  },

  // --------------------------------------------------------------------------
  // Atualiza fornecedor existente
  // --------------------------------------------------------------------------
  // 1. buscarPorId ja lanca 404 se o id nao existir.
  // 2. update pode esbarrar no UNIQUE do cnpj (colidir com OUTRO
  //    fornecedor) — traduzido em 409.
  // --------------------------------------------------------------------------
  async atualizar(id: number, input: EntradaAtualizarFornecedor) {
    await this.buscarPorId(id);
    try {
      return await fornecedorRepository.update(id, input);
    } catch (err) {
      traduzErroDeUnicidade(err);
    }
  },

  // --------------------------------------------------------------------------
  // Remove fornecedor
  // --------------------------------------------------------------------------
  // Nao ha regra bloqueando (diferente do produto, que nao pode ser
  // removido se ja foi vendido). A FK de produto -> fornecedor e'
  // ON DELETE SET NULL: os produtos do fornecedor apenas ficam sem
  // fornecedor vinculado. Os emails/telefones somem via ON DELETE CASCADE.
  // --------------------------------------------------------------------------
  async remover(id: number) {
    await this.buscarPorId(id);
    await fornecedorRepository.delete(id);
  },
};
