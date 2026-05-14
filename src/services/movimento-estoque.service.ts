import { movimentoEstoqueRepository } from "../repositories/movimento-estoque.repository";
import { produtoRepository } from "../repositories/produto.repository";
import { EntradaCriarMovimento } from "../models/movimento-estoque.model";
import { AppError } from "../errors/app-error";

export async function criarMovimento(dados: EntradaCriarMovimento) {
  const produto = await produtoRepository.findById(dados.id_produto);
  if (!produto) throw new AppError("Produto não encontrado", 404);

  if (dados.tipo === "SAIDA" && produto.estoque < dados.quantidade) {
    throw new AppError("Estoque insuficiente para essa saída", 400);
  }

  const novoEstoque =
    dados.tipo === "ENTRADA"
      ? produto.estoque + dados.quantidade
      : produto.estoque - dados.quantidade;

  await produtoRepository.update(produto.id_produto, { estoque: novoEstoque });

  return movimentoEstoqueRepository.create(dados);
}

export async function listarMovimentosPorProduto(id_produto: number) {
  return movimentoEstoqueRepository.findByProdutoId(id_produto);
}

export async function listarTodosMovimentos() {
  return movimentoEstoqueRepository.findAll();
}