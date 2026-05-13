import sqlite3 from "sqlite3";
import { db } from "../config/database";
import { PedidoComItens, ItemPedido } from "../models/pedido.model";

export const pedidoRepository = {
createPedido(
  id_cliente: number,
  forma_pagamento: string,
  status: string,
  itens: { id_produto: number; quantidade: number; preco_unitario: number }[],
  total: number
): Promise<PedidoComItens> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO pedido (id_cliente, forma_pagamento, status, total_pedido, criado_em, atualizado_em)
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id_cliente, forma_pagamento, status, total],
      function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return reject(err);

        const id_pedido = this.lastID;

        itens.forEach((item) => {
          const subtotal = item.preco_unitario * item.quantidade;
          db.run(
            `INSERT INTO item_pedido (id_pedido, id_produto, quantidade, subtotal)
             VALUES (?, ?, ?, ?)`,
            [id_pedido, item.id_produto, item.quantidade, subtotal]
          );
        });

        // 🔹 Aqui entra a correção
        pedidoRepository.findById(id_pedido)
          .then((pedido) => resolve(pedido!)) // garante que não será null
          .catch(reject);
      }
    );
  });
},

  findById(id: number): Promise<PedidoComItens | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const pedido = await new Promise<any>((res, rej) => {
          db.get("SELECT * FROM pedido WHERE id_pedido = ?", [id], (err, row) => {
            if (err) rej(err);
            else res(row ?? null);
          });
        });

        if (!pedido) return resolve(null);

        const itens = await new Promise<ItemPedido[]>((res, rej) => {
          db.all("SELECT * FROM item_pedido WHERE id_pedido = ?", [id], (err, rows) => {
            if (err) rej(err);
            else res(rows as ItemPedido[]);
          });
        });

        resolve({ ...pedido, itens });
      } catch (err) {
        reject(err);
      }
    });
  },
  update(
  id: number,
  input: { status?: string; forma_pagamento?: string }
): Promise<PedidoComItens | null> {
  return new Promise((resolve, reject) => {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.status !== undefined) {
      fields.push("status = ?");
      values.push(input.status);
    }
    if (input.forma_pagamento !== undefined) {
      fields.push("forma_pagamento = ?");
      values.push(input.forma_pagamento);
    }

    if (fields.length === 0) {
      return pedidoRepository.findById(id).then(resolve).catch(reject);
    }

    values.push(id);

    const sql = `UPDATE pedido SET ${fields.join(", ")}, atualizado_em = datetime('now') WHERE id_pedido = ?`;
    db.run(sql, values, (err: Error | null) => {
      if (err) return reject(err);
      pedidoRepository.findById(id).then(resolve).catch(reject);
    });
  });
},

findByClienteId(id_cliente: number): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM pedido WHERE id_cliente = ? ORDER BY id_pedido DESC",
      [id_cliente],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      }
    );
  });
},
  
delete(id: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM pedido WHERE id_pedido = ?",
      [id],
      function (this: sqlite3.RunResult, err: Error | null) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      }
    );
  });
},

};
