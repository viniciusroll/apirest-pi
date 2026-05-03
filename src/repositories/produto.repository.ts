// ============================================================================
// produto.repository.ts — camada de acesso ao banco para Produto
// ============================================================================
// Responsabilidade: SQL puro. So conversa com o banco.
// NAO tem regra de negocio (isso fica no service).
// NAO retorna erros HTTP (isso fica no controller/middleware).
//
// Por que envolver tudo em Promise?
// O driver sqlite3 usa CALLBACKS (estilo antigo do Node). Para usar
// async/await no service, envolvemos cada chamada em new Promise().
//
// Por que sempre placeholders ('?') e nunca concatenar string?
// Porque concatenar string em SQL abre brecha pra SQL injection.
// Os placeholders fazem o driver escapar os valores automaticamente.
// ============================================================================

import sqlite3 from "sqlite3";
import { db } from "../config/database";
import {
  Produto,
  EntradaCriarProduto,
  EntradaAtualizarProduto,
} from "../models/produto.model";

export const produtoRepository = {
  // --------------------------------------------------------------------------
  // Lista TODOS os produtos, ordenados por id (mais antigos primeiro)
  // --------------------------------------------------------------------------
  findAll(): Promise<Produto[]> {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM produto ORDER BY id_produto",
        (err: Error | null, rows: Produto[]) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });
  },

  // --------------------------------------------------------------------------
  // Busca um produto pelo id. Retorna null se nao existir.
  // --------------------------------------------------------------------------
  findById(id: number): Promise<Produto | null> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM produto WHERE id_produto = ?",
        [id],
        (err: Error | null, row: Produto | undefined) => {
          if (err) reject(err);
          else resolve(row ?? null);
        },
      );
    });
  },

  // --------------------------------------------------------------------------
  // Cria um produto e retorna o registro completo (com id gerado).
  // --------------------------------------------------------------------------
  // 'function (this: sqlite3.RunResult, err)' (funcao tradicional + tipagem
  // do 'this') e necessario aqui — o sqlite3 expoe 'this.lastID' e
  // 'this.changes' atraves do 'this' do callback. Arrow function nao
  // captura esse 'this'.
  // --------------------------------------------------------------------------
  create(input: EntradaCriarProduto): Promise<Produto> {
    return new Promise((resolve, reject) => {
      const {
        nome,
        preco,
        estoque,
        validade,
        categoria,
        id_fornecedor,
      } = input;

      db.run(
        `INSERT INTO produto
           (nome, preco, estoque, validade, categoria, id_fornecedor)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          nome,
          preco,
          estoque,
          validade ?? null,
          categoria ?? null,
          id_fornecedor ?? null,
        ],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) return reject(err);
          // 'this.lastID' = id do registro recem-inserido
          produtoRepository
            .findById(this.lastID)
            .then((p) => resolve(p!))
            .catch(reject);
        },
      );
    });
  },

  // --------------------------------------------------------------------------
  // Atualiza um produto. Aceita atualizacao PARCIAL (so os campos enviados).
  // --------------------------------------------------------------------------
  // Estrategia:
  //   1. Monta dinamicamente "campo1 = ?, campo2 = ?" so para os campos
  //      que vieram no input.
  //   2. Se nada veio, retorna o produto atual sem rodar UPDATE.
  //   3. Caso contrario, executa o UPDATE com os valores na ordem correta.
  // --------------------------------------------------------------------------
  update(id: number, input: EntradaAtualizarProduto): Promise<Produto | null> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: unknown[] = [];

      if (input.nome !== undefined) {
        fields.push("nome = ?");
        values.push(input.nome);
      }
      if (input.preco !== undefined) {
        fields.push("preco = ?");
        values.push(input.preco);
      }
      if (input.estoque !== undefined) {
        fields.push("estoque = ?");
        values.push(input.estoque);
      }
      if (input.validade !== undefined) {
        fields.push("validade = ?");
        values.push(input.validade);
      }
      if (input.categoria !== undefined) {
        fields.push("categoria = ?");
        values.push(input.categoria);
      }
      if (input.id_fornecedor !== undefined) {
        fields.push("id_fornecedor = ?");
        values.push(input.id_fornecedor);
      }

      // Nada para atualizar — devolve o registro atual sem rodar UPDATE
      if (fields.length === 0) {
        return produtoRepository.findById(id).then(resolve).catch(reject);
      }

      // Adiciona o id no final dos valores (vai pro WHERE id_produto = ?)
      values.push(id);

      const sql = `UPDATE produto SET ${fields.join(", ")} WHERE id_produto = ?`;
      db.run(sql, values, (err: Error | null) => {
        if (err) return reject(err);
        produtoRepository.findById(id).then(resolve).catch(reject);
      });
    });
  },

  // --------------------------------------------------------------------------
  // Deleta um produto. Retorna true se removeu, false se id nao existia.
  // --------------------------------------------------------------------------
  // 'this.changes' = numero de linhas afetadas pelo DELETE.
  // Se 0, significa que o id nao existia.
  // --------------------------------------------------------------------------
  delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM produto WHERE id_produto = ?",
        [id],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        },
      );
    });
  },

  // --------------------------------------------------------------------------
  // Verifica se o produto esta em algum item_pedido (RN07 — nao deletar
  // produto que ja foi vendido). Usado pelo service antes do delete.
  // --------------------------------------------------------------------------
  // 'SELECT 1 ... LIMIT 1' e mais rapido que SELECT * — so precisamos saber
  // se EXISTE pelo menos um.
  //
  // !!row converte:
  //   undefined  ->  false  (nenhum item encontrado)
  //   { 1: 1 }   ->  true   (achou pelo menos 1)
  // --------------------------------------------------------------------------
  existeEmPedido(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT 1 FROM item_pedido WHERE id_produto = ? LIMIT 1",
        [id],
        (err: Error | null, row: unknown) => {
          if (err) reject(err);
          else resolve(!!row);
        },
      );
    });
  },
};