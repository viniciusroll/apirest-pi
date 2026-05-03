// ============================================================================
// produto.service.ts — regras de negocio da entidade Produto
// ============================================================================
// Esta camada fica entre o controller (que recebe HTTP) e o repository (que
// fala com banco). Aqui ficam:
//
//   1. Regras que o banco nao garante sozinho
//      - Ex.: "nao pode deletar produto que ja esta em pedido" (RN07)
//
//   2. Conversao de "registro nao encontrado" em erro 404
//      - O repository devolve null. O service joga AppError.
//
//   3. Orquestracao de varias chamadas de repository quando precisa
//      - Ex.: buscar antes de atualizar (pra ter certeza que existe)
//
// O service NAO conhece req/res/next. Ele e' puro — recebe input,
// devolve dados ou lanca erro. Isso facilita testar e reusar.
// ============================================================================

import { produtoRepository } from "../repositories/produto.repository";
import {
  EntradaCriarProduto,
  EntradaAtualizarProduto,
} from "../models/produto.model";
import { AppError } from "../errors/app-error";

export const produtoService = {
  // --------------------------------------------------------------------------
  // Lista todos os produtos
  // --------------------------------------------------------------------------
  // Aqui nao tem regra de negocio especial — apenas delega ao repository.
  // Note que NAO precisamos de async/await neste caso: simplesmente
  // retornamos a Promise diretamente. Quem chamar usa await.
  // --------------------------------------------------------------------------
  listar() {
    return produtoRepository.findAll();
  },

  // --------------------------------------------------------------------------
  // Busca por id — joga 404 se nao existir
  // --------------------------------------------------------------------------
  // O repository devolve null quando nao acha. Aqui convertemos em erro
  // com statusCode 404, que o middleware de erro vai transformar em
  // resposta HTTP apropriada.
  // --------------------------------------------------------------------------
  async buscarPorId(id: number) {
    const produto = await produtoRepository.findById(id);
    if (!produto) {
      throw new AppError("Produto nao encontrado", 404);
    }
    return produto;
  },

  // --------------------------------------------------------------------------
  // Cria um novo produto
  // --------------------------------------------------------------------------
  // Validacao de formato (preco > 0, estoque >= 0, etc.) ja foi feita
  // pelo schema Zod no controller. O banco tambem tem CHECK constraints
  // como ultima linha de defesa. Aqui nao precisamos repetir.
  // --------------------------------------------------------------------------
  criar(input: EntradaCriarProduto) {
    return produtoRepository.create(input);
  },

  // --------------------------------------------------------------------------
  // Atualiza produto existente
  // --------------------------------------------------------------------------
  // Estrategia:
  //   1. Tenta buscar o produto — se nao existe, joga 404 (via buscarPorId)
  //   2. Se existe, manda atualizar
  //
  // Por que checar antes de atualizar?
  // O UPDATE direto sem checagem seria silencioso: se o id nao existe,
  // o SQL nao da erro, so atualiza zero linhas. O cliente ficaria sem
  // saber que o produto nao existia. Melhor avisar com 404.
  // --------------------------------------------------------------------------
  async atualizar(id: number, input: EntradaAtualizarProduto) {
    await this.buscarPorId(id); // ja lanca 404 se nao existir
    return produtoRepository.update(id, input);
  },

  // --------------------------------------------------------------------------
  // Remove produto — atende RN07 (nao deletar produto vendido)
  // --------------------------------------------------------------------------
  // Estrategia:
  //   1. Garante que o produto existe (404 se nao)
  //   2. Verifica se ele esta em algum item_pedido
  //      - Se SIM: 409 Conflict (nao pode deletar — ha historico de venda)
  //      - Se NAO: deleta normalmente
  //
  // Por que 409 e nao 400?
  // 400 = "voce mandou request mal formado".
  // 409 = "request OK, mas o estado atual do recurso nao permite essa acao".
  // E exatamente o caso aqui: o pedido faz sentido, mas conflita com a regra.
  //
  // Em vez de deletar de verdade, valeria implementar SOFT DELETE no
  // futuro (marcar como inativo). Por hora seguimos o que o professor pede.
  // --------------------------------------------------------------------------
  async remover(id: number) {
    await this.buscarPorId(id); // 404 se nao existir

    const emPedido = await produtoRepository.existeEmPedido(id);
    if (emPedido) {
      throw new AppError(
        "Produto nao pode ser removido: ha pedidos associados",
        409,
      );
    }

    await produtoRepository.delete(id);
  },
};