// ============================================================================
// fornecedor.repository.ts — camada de acesso ao banco para Fornecedor
// ============================================================================
// Responsabilidade: SQL puro. So conversa com o banco.
// NAO tem regra de negocio (isso fica no service).
// NAO retorna erros HTTP (isso fica no controller/middleware).
//
// Diferenca pro produto.repository: Fornecedor usa TRES tabelas porque
// email e telefone sao atributos MULTIVALORADOS (um fornecedor pode ter
// varios). O DER separou em:
//
//   fornecedor            — dados principais (nome, cnpj, endereco...)
//   email_fornecedor      — N emails apontando para id_fornecedor
//   telefone_fornecedor   — N telefones apontando para id_fornecedor
//
// Por isso o repository "monta" o objeto FornecedorCompleto juntando as
// tres consultas (a tabela base + os emails + os telefones).
//
// Por que envolver tudo em Promise?
// O driver sqlite3 usa CALLBACKS. Para usar async/await no service,
// envolvemos cada chamada em new Promise().
//
// Por que sempre placeholders ('?') e nunca concatenar string?
// Concatenar string em SQL abre brecha pra SQL injection. Os
// placeholders fazem o driver escapar os valores automaticamente.
// ============================================================================

import sqlite3 from "sqlite3";
import { db } from "../config/database";
import {
  Fornecedor,
  FornecedorCompleto,
  EntradaCriarFornecedor,
  EntradaAtualizarFornecedor,
} from "../models/fornecedor.model";

// ----------------------------------------------------------------------------
// Helpers internos (nao exportados) — buscam os atributos multivalorados
// de UM fornecedor. Usados pelo findById para montar o objeto completo.
// ----------------------------------------------------------------------------
function buscarEmails(idFornecedor: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT email FROM email_fornecedor WHERE id_fornecedor = ? ORDER BY id",
      [idFornecedor],
      (err: Error | null, rows: { email: string }[]) => {
        if (err) reject(err);
        else resolve(rows.map((r) => r.email));
      },
    );
  });
}

function buscarTelefones(idFornecedor: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT telefone FROM telefone_fornecedor WHERE id_fornecedor = ? ORDER BY id",
      [idFornecedor],
      (err: Error | null, rows: { telefone: string }[]) => {
        if (err) reject(err);
        else resolve(rows.map((r) => r.telefone));
      },
    );
  });
}

// ----------------------------------------------------------------------------
// Helpers de escrita usados pelo create (e mais tarde pelo update).
// Como o INSERT do fornecedor + N emails + N telefones precisa ser ATOMICO
// (ou grava tudo, ou nada), envolvemos numa transacao manual:
//
//   BEGIN -> inserts -> COMMIT     (deu tudo certo)
//   BEGIN -> erro    -> ROLLBACK   (desfaz o que ja tinha inserido)
//
// 'executar' roda um comando sem retorno. 'inserirEObterId' roda um INSERT
// e devolve o id gerado (this.lastID — por isso a function tradicional com
// 'this' tipado, igual ao produto.repository).
//
// Observacao: a transacao usa a conexao global. Para o volume de uma loja
// (um operador por vez) isso e' suficiente — mesma simplificacao adotada
// no resto do projeto.
// ----------------------------------------------------------------------------
function executar(sql: string, params: unknown[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function inserirEObterId(sql: string, params: unknown[]): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

export const fornecedorRepository = {
  // --------------------------------------------------------------------------
  // Lista TODOS os fornecedores (com emails e telefones), ordenados por id.
  // --------------------------------------------------------------------------
  // Estrategia anti N+1: em vez de uma consulta de contatos por fornecedor,
  // fazemos 3 consultas (base + todos os emails + todos os telefones) e
  // agrupamos em memoria com Maps. Para o volume de uma loja isso e' de
  // longe suficiente e mantem o codigo simples.
  // --------------------------------------------------------------------------
  findAll(): Promise<FornecedorCompleto[]> {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM fornecedor ORDER BY id_fornecedor",
        (err: Error | null, fornecedores: Fornecedor[]) => {
          if (err) return reject(err);

          db.all(
            "SELECT id_fornecedor, email FROM email_fornecedor ORDER BY id",
            (
              errE: Error | null,
              emails: { id_fornecedor: number; email: string }[],
            ) => {
              if (errE) return reject(errE);

              db.all(
                "SELECT id_fornecedor, telefone FROM telefone_fornecedor ORDER BY id",
                (
                  errT: Error | null,
                  telefones: { id_fornecedor: number; telefone: string }[],
                ) => {
                  if (errT) return reject(errT);

                  // Agrupa emails/telefones por id_fornecedor
                  const emailsPorId = new Map<number, string[]>();
                  for (const e of emails) {
                    const lista = emailsPorId.get(e.id_fornecedor) ?? [];
                    lista.push(e.email);
                    emailsPorId.set(e.id_fornecedor, lista);
                  }

                  const telsPorId = new Map<number, string[]>();
                  for (const t of telefones) {
                    const lista = telsPorId.get(t.id_fornecedor) ?? [];
                    lista.push(t.telefone);
                    telsPorId.set(t.id_fornecedor, lista);
                  }

                  const completos: FornecedorCompleto[] = fornecedores.map(
                    (f) => ({
                      ...f,
                      emails: emailsPorId.get(f.id_fornecedor) ?? [],
                      telefones: telsPorId.get(f.id_fornecedor) ?? [],
                    }),
                  );

                  resolve(completos);
                },
              );
            },
          );
        },
      );
    });
  },

  // --------------------------------------------------------------------------
  // Busca um fornecedor pelo id, ja com emails e telefones. null se nao achar.
  // --------------------------------------------------------------------------
  // Primeiro busca a linha base. So se ela existir vale a pena ir buscar
  // os contatos (Promise.all roda as duas consultas em paralelo).
  // --------------------------------------------------------------------------
  async findById(id: number): Promise<FornecedorCompleto | null> {
    const fornecedor = await new Promise<Fornecedor | null>(
      (resolve, reject) => {
        db.get(
          "SELECT * FROM fornecedor WHERE id_fornecedor = ?",
          [id],
          (err: Error | null, row: Fornecedor | undefined) => {
            if (err) reject(err);
            else resolve(row ?? null);
          },
        );
      },
    );

    if (!fornecedor) return null;

    const [emails, telefones] = await Promise.all([
      buscarEmails(id),
      buscarTelefones(id),
    ]);

    return { ...fornecedor, emails, telefones };
  },

  // --------------------------------------------------------------------------
  // Cria um fornecedor + seus emails + seus telefones, de forma ATOMICA.
  // --------------------------------------------------------------------------
  // Se qualquer insert falhar (ex.: cnpj duplicado viola o UNIQUE, ou um
  // email repetido viola UNIQUE(id_fornecedor,email)), o ROLLBACK desfaz
  // tudo — nunca fica um fornecedor "pela metade".
  //
  // Devolve o registro completo recem-criado (reaproveitando findById).
  // --------------------------------------------------------------------------
  async create(input: EntradaCriarFornecedor): Promise<FornecedorCompleto> {
    const { nome, cnpj, endereco, tempo_entrega, emails, telefones } = input;

    await executar("BEGIN TRANSACTION");
    try {
      const idFornecedor = await inserirEObterId(
        `INSERT INTO fornecedor (nome, cnpj, endereco, tempo_entrega)
         VALUES (?, ?, ?, ?)`,
        [nome, cnpj, endereco ?? null, tempo_entrega ?? null],
      );

      for (const email of emails) {
        await executar(
          "INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (?, ?)",
          [idFornecedor, email],
        );
      }

      for (const telefone of telefones) {
        await executar(
          "INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (?, ?)",
          [idFornecedor, telefone],
        );
      }

      await executar("COMMIT");

      // findById nao devolve null aqui (acabamos de inserir) — o '!' so
      // tranquiliza o TypeScript.
      return (await fornecedorRepository.findById(idFornecedor))!;
    } catch (err) {
      await executar("ROLLBACK");
      throw err;
    }
  },

  // --------------------------------------------------------------------------
  // Atualiza um fornecedor. Aceita atualizacao PARCIAL (so o que veio).
  // --------------------------------------------------------------------------
  // Estrategia:
  //   1. Monta dinamicamente "campo = ?" so para os campos da TABELA
  //      fornecedor que vieram no input (igual ao produto.repository).
  //   2. emails/telefones sao multivalorados — a forma mais simples e
  //      previsivel de "atualizar" e SUBSTITUIR a lista inteira: apaga as
  //      antigas e insere as novas. So mexe se o campo veio no input.
  //   3. Tudo dentro de uma transacao (mexe em ate 3 tabelas).
  //
  // O service garante que o id existe (lanca 404 antes de chamar) — mesma
  // divisao de responsabilidade do modulo Produto.
  // --------------------------------------------------------------------------
  async update(
    id: number,
    input: EntradaAtualizarFornecedor,
  ): Promise<FornecedorCompleto | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.nome !== undefined) {
      fields.push("nome = ?");
      values.push(input.nome);
    }
    if (input.cnpj !== undefined) {
      fields.push("cnpj = ?");
      values.push(input.cnpj);
    }
    if (input.endereco !== undefined) {
      fields.push("endereco = ?");
      values.push(input.endereco);
    }
    if (input.tempo_entrega !== undefined) {
      fields.push("tempo_entrega = ?");
      values.push(input.tempo_entrega);
    }

    const mexeEmContatos =
      input.emails !== undefined || input.telefones !== undefined;

    // Nada para atualizar (nem campos, nem contatos) — devolve o atual
    if (fields.length === 0 && !mexeEmContatos) {
      return fornecedorRepository.findById(id);
    }

    await executar("BEGIN TRANSACTION");
    try {
      if (fields.length > 0) {
        await executar(
          `UPDATE fornecedor SET ${fields.join(", ")} WHERE id_fornecedor = ?`,
          [...values, id],
        );
      }

      if (input.emails !== undefined) {
        await executar(
          "DELETE FROM email_fornecedor WHERE id_fornecedor = ?",
          [id],
        );
        for (const email of input.emails) {
          await executar(
            "INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (?, ?)",
            [id, email],
          );
        }
      }

      if (input.telefones !== undefined) {
        await executar(
          "DELETE FROM telefone_fornecedor WHERE id_fornecedor = ?",
          [id],
        );
        for (const telefone of input.telefones) {
          await executar(
            "INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (?, ?)",
            [id, telefone],
          );
        }
      }

      await executar("COMMIT");
      return fornecedorRepository.findById(id);
    } catch (err) {
      await executar("ROLLBACK");
      throw err;
    }
  },
};
