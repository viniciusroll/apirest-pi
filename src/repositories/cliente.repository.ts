// ============================================================================
// cliente.repository.ts — camada de acesso ao banco para Cliente
// ============================================================================
// Responsabilidade: SQL puro. Só conversa com o banco.
// NÃO tem regra de negócio (isso fica no service).
// NÃO retorna erros HTTP (isso fica no controller/middleware).
//
// Observação: usamos Promise para poder trabalhar com async/await.
// O sqlite3 expõe lastID e changes via "this" do callback tradicional.
// ============================================================================

import sqlite3 from "sqlite3";
import { db } from "../config/database";
import {
  Cliente,
  EntradaCriarCliente,
  EntradaAtualizarCliente,
  ClienteCompleto,
} from "../models/cliente.model";

export const clienteRepository = {
  // --------------------------------------------------------------------------
  // Lista TODOS os clientes com emails e telefones
  // --------------------------------------------------------------------------
  findAll(): Promise<ClienteCompleto[]> {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM cliente ORDER BY id_cliente", (err, clientes: Cliente[]) => {
        if (err) return reject(err);
        db.all("SELECT id_cliente, email FROM email_cliente ORDER BY id", (errE, emails: { id_cliente: number; email: string }[]) => {
          if (errE) return reject(errE);
          db.all("SELECT id_cliente, telefone FROM telefone_cliente ORDER BY id", (errT, telefones: { id_cliente: number; telefone: string }[]) => {
            if (errT) return reject(errT);
            const emailsPorId = new Map<number, string[]>();
            for (const e of emails) { const l = emailsPorId.get(e.id_cliente) ?? []; l.push(e.email); emailsPorId.set(e.id_cliente, l); }
            const telsPorId = new Map<number, string[]>();
            for (const t of telefones) { const l = telsPorId.get(t.id_cliente) ?? []; l.push(t.telefone); telsPorId.set(t.id_cliente, l); }
            resolve(clientes.map(c => ({ ...c, emails: emailsPorId.get(c.id_cliente) ?? [], telefones: telsPorId.get(c.id_cliente) ?? [] })));
          });
        });
      });
    });
  },

  // --------------------------------------------------------------------------
  // Busca cliente por ID
  // --------------------------------------------------------------------------
  findById(id: number): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM cliente WHERE id_cliente = ?",
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve((row as Cliente) ?? null);
        }
      );
    });
  },

  // --------------------------------------------------------------------------
  // Busca cliente por CPF (para evitar duplicidade)
  // --------------------------------------------------------------------------
  findByCpf(cpf: string): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM cliente WHERE cpf = ?",
        [cpf],
        (err, row) => {
          if (err) reject(err);
          else resolve((row as Cliente) ?? null);
        }
      );
    });
  },

  // --------------------------------------------------------------------------
  // Cria cliente + emails + telefones
  // --------------------------------------------------------------------------
  create(
    input: EntradaCriarCliente,
    emails: string[],
    telefones: string[]
  ): Promise<ClienteCompleto> {
    return new Promise((resolve, reject) => {
      const { nome, cpf, endereco } = input;

      db.run(
        `INSERT INTO cliente (nome, cpf, endereco, criado_em)
         VALUES (?, ?, ?, datetime('now'))`,
        [nome, cpf, endereco ?? null],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) return reject(err);

          const id_cliente = this.lastID;

          // inserir emails
          emails.forEach((email) => {
            db.run(
              `INSERT INTO email_cliente (id_cliente, email) VALUES (?, ?)`,
              [id_cliente, email]
            );
          });

          // inserir telefones
          telefones.forEach((telefone) => {
            db.run(
              `INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (?, ?)`,
              [id_cliente, telefone]
            );
          });

          // retorna cliente completo
          clienteRepository
            .findCompletoById(id_cliente)
            .then((c) => resolve(c!))
            .catch(reject);
        }
      );
    });
  },

  // --------------------------------------------------------------------------
  // Atualiza cliente (parcial)
  // --------------------------------------------------------------------------
  update(id: number, input: EntradaAtualizarCliente): Promise<Cliente | null> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: unknown[] = [];

      if (input.nome !== undefined) {
        fields.push("nome = ?");
        values.push(input.nome);
      }
      if (input.cpf !== undefined) {
        fields.push("cpf = ?");
        values.push(input.cpf);
      }
      if (input.endereco !== undefined) {
        fields.push("endereco = ?");
        values.push(input.endereco);
      }

      if (fields.length === 0) {
        return clienteRepository.findById(id).then(resolve).catch(reject);
      }

      values.push(id);
      const sql = `UPDATE cliente SET ${fields.join(", ")} WHERE id_cliente = ?`;

      db.run(sql, values, (err: Error | null) => {
        if (err) return reject(err);
        clienteRepository.findById(id).then(resolve).catch(reject);
      });
    });
  },

  // --------------------------------------------------------------------------
  // Deleta cliente. Retorna true se removeu, false se não existia.
  // --------------------------------------------------------------------------
  delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM cliente WHERE id_cliente = ?",
        [id],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) reject(err);
          else resolve(this.changes > 0);
        }
      );
    });
  },

  // --------------------------------------------------------------------------
  // Retorna cliente completo (com emails e telefones)
  // --------------------------------------------------------------------------
  findCompletoById(id: number): Promise<ClienteCompleto | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const cliente = await clienteRepository.findById(id);
        if (!cliente) return resolve(null);

        const emails = await new Promise<string[]>((res, rej) => {
          db.all(
            "SELECT email FROM email_cliente WHERE id_cliente = ?",
            [id],
            (err, rows) => {
              if (err) rej(err);
              else res(rows.map((r: any) => r.email));
            }
          );
        });

        const telefones = await new Promise<string[]>((res, rej) => {
          db.all(
            "SELECT telefone FROM telefone_cliente WHERE id_cliente = ?",
            [id],
            (err, rows) => {
              if (err) rej(err);
              else res(rows.map((r: any) => r.telefone));
            }
          );
        });

        resolve({ ...cliente, emails, telefones });
      } catch (err) {
        reject(err);
      }
    });
  },
};