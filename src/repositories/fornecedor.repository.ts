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

import { db } from "../config/database";
import { Fornecedor, FornecedorCompleto } from "../models/fornecedor.model";

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
};
