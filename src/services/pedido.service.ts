import { pedidoRepository } from "../repositories/pedido.repository";
import { produtoRepository } from "../repositories/produto.repository";
import { EntradaCriarPedido, PedidoComItens, StatusPedido } from "../models/pedido.model";
import { AppError } from "../errors/app-error";

export async function criarPedido(dados: EntradaCriarPedido): Promise<PedidoComItens> {
  let total = 0;
  const itensProcessados: { id_produto: number; quantidade: number; preco_unitario: number }[] = [];

  for (const item of dados.itens) {
    const produto = await produtoRepository.findById(item.id_produto);
    if (!produto) throw new AppError("Produto não encontrado", 404);

    if (produto.estoque < item.quantidade) {
      throw new AppError(`Estoque insuficiente para produto ${produto.nome}`, 400);
    }

    const precoUnitario = produto.preco; // 🔹 congela preço no momento da venda
    const subtotal = precoUnitario * item.quantidade;
    total += subtotal;

    itensProcessados.push({ ...item, preco_unitario: precoUnitario });

    // 🔹 atualiza estoque
    await produtoRepository.update(produto.id_produto, {
      estoque: produto.estoque - item.quantidade,
    });
  }

  return pedidoRepository.createPedido(
    dados.id_cliente,
    dados.forma_pagamento,
    dados.status ?? "PENDENTE",
    itensProcessados,
    total
  );
}

export async function buscarPedidoPorId(id: number) {
  const pedido = await pedidoRepository.findById(id);
  if (!pedido) throw new AppError("Pedido não encontrado", 404);
  return pedido;
}

export async function atualizarPedido(id: number, status?: StatusPedido, forma_pagamento?: string) {
  const pedido = await pedidoRepository.findById(id);
  if (!pedido) throw new AppError("Pedido não encontrado", 404);

  if (pedido.status === "PAGO" && status === "CANCELADO") {
    throw new AppError("Não é possível cancelar pedido já pago", 400);
  }

  return pedidoRepository.update(id, { status, forma_pagamento });
}

export async function listarPedidosPorCliente(id_cliente: number) {
  return pedidoRepository.findByClienteId(id_cliente);
}

export async function excluirPedido(id: number) {
  const pedido = await pedidoRepository.findById(id);
  if (!pedido) throw new AppError("Pedido não encontrado", 404);

  if (pedido.status === "PAGO") {
    throw new AppError("Não é possível excluir pedido já pago", 400);
  }

  return pedidoRepository.delete(id);
}
