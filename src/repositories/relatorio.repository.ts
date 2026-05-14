import { db } from "../config/database";

export const relatorioRepository = {
  clientesInadimplentes(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT
           c.id_cliente,
           c.nome,
           c.cpf,
           COUNT(p.id_pedido) AS total_pedidos_fiado,
           SUM(p.total_pedido)  AS valor_total_em_aberto
         FROM pedido p
         JOIN cliente c ON c.id_cliente = p.id_cliente
         WHERE p.forma_pagamento = 'FIADO' AND p.status = 'PENDENTE'
         GROUP BY c.id_cliente
         ORDER BY valor_total_em_aberto DESC`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as any[]);
        }
      );
    });
  },

  vendasPorPeriodo(inicio: string, fim: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
           COUNT(*)            AS total_pedidos,
           SUM(total_pedido)   AS receita_total,
           AVG(total_pedido)   AS ticket_medio
         FROM pedido
         WHERE status != 'CANCELADO'
           AND DATE(criado_em) BETWEEN ? AND ?`,
        [inicio, fim],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  produtosMaisVendidos(limite: number = 10): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT
           p.id_produto,
           p.nome,
           p.categoria,
           SUM(ip.quantidade)                    AS total_vendido,
           SUM(ip.quantidade * ip.preco_unitario) AS receita_gerada
         FROM item_pedido ip
         JOIN produto p ON p.id_produto = ip.id_produto
         JOIN pedido  pe ON pe.id_pedido = ip.id_pedido
         WHERE pe.status != 'CANCELADO'
         GROUP BY p.id_produto
         ORDER BY total_vendido DESC
         LIMIT ?`,
        [limite],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as any[]);
        }
      );
    });
  },

  estoqueBaixo(limite: number = 10): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT
           id_produto,
           nome,
           categoria,
           estoque,
           validade
         FROM produto
         WHERE estoque <= ?
         ORDER BY estoque ASC`,
        [limite],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as any[]);
        }
      );
    });
  },
};