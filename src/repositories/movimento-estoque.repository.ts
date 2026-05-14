import sqlite3 from "sqlite3";
import { db } from "../config/database";
import { MovimentoEstoque, EntradaCriarMovimento } from "../models/movimento-estoque.model";

export const movimentoEstoqueRepository = {
  create(input: EntradaCriarMovimento): Promise<MovimentoEstoque> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO movimento_estoque (id_produto, id_usuario, id_item, tipo, quantidade)
         VALUES (?, ?, ?, ?, ?)`,
        [input.id_produto, input.id_usuario, input.id_item ?? null, input.tipo, input.quantidade],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) return reject(err);
          const id = this.lastID;
          db.get(
            "SELECT * FROM movimento_estoque WHERE id_movimento = ?",
            [id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row as MovimentoEstoque);
            }
          );
        }
      );
    });
  },

  findByProdutoId(id_produto: number): Promise<MovimentoEstoque[]> {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM movimento_estoque WHERE id_produto = ? ORDER BY data_movimento DESC",
        [id_produto],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as MovimentoEstoque[]);
        }
      );
    });
  },

  findAll(): Promise<MovimentoEstoque[]> {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM movimento_estoque ORDER BY data_movimento DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as MovimentoEstoque[]);
        }
      );
    });
  },
};