import sqlite3 from "sqlite3";
import { db } from "../config/database";
import { 
    Fornecedor, 
    EntradaCriarFornecedor,
    EntradaAtualizarFornecedor,
    FornecedorCompleto
} from "../models/fornecedor.model";


export const fornecedorRepository = {

    // --------------------------------------------------------------------------
    // Lista TODOS os fornecedores
    // --------------------------------------------------------------------------
    findAll(): Promise<Fornecedor[]> {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM fornecedor ORDER BY id_fornecedor", (err, rows) => {
                if (err) reject(err);
                else resolve(rows as Fornecedor[]);
            });
        });
    },
    
    // --------------------------------------------------------------------------
    // Busca fornecedor por ID
    // --------------------------------------------------------------------------
    findByID(id: number): Promise<Fornecedor | null> {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM fornecedores WHERE id_fornecedor = ?",
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve((row as Fornecedor) ?? null);
                }
            );
        });
    },
    
    // --------------------------------------------------------------------------
    // Busca fornecedor por CNPJ (para evitar duplicidade)
    // --------------------------------------------------------------------------
    findByCNPJ(cnpj: string): Promise<Fornecedor | null> {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM Fornecedor WHERE cnpj = ?",
                [cnpj],
                (err, row) => {
                    if (err) reject(err);
                    else resolve((row as Fornecedor) ?? null);
                }
            );
        });
    },

    // --------------------------------------------------------------------------
    // Cria fornecedor + emails + telefones
    // --------------------------------------------------------------------------
    create(
        input: EntradaCriarFornecedor,
        emails: string[],
        telefones: string[]
    ): Promise<FornecedorCompleto> {
        return new Promise((resolve, reject) => {
            const { nome, cnpj, endereco, tempo_entrega } = input;

            db.run(
                `INSERT INTO fornecedor (nome, cnpj, endereco, tempo_entrega, criado_em)
                VALUES (?, ?, ?, ?, datetime('now'))`,
                [nome, cnpj, endereco, tempo_entrega ?? null],
                function (this: sqlite3.RunResult, err: Error | null) {
                    if (err) return reject(err);

                    const id_fornecedor = this.lastID
                    
                    // Insere os emails no fornecedor
                    emails.forEach((email) => {
                        db.run(
                            `INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (?, ?)`,
                            [id_fornecedor, email]
                        );
                    });

                    // Insere os telefones no fornecedor
                    telefones.forEach((telefone) => {
                        db.run(
                            `INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (?, ?)`,
                            [id_fornecedor, telefone]
                        );
                    });
                    
                    // Retorna fornecedor completo
                    fornecedorRepository
                        .findCompleteByID(id_fornecedor)
                        .then((c) => resolve(c!))
                        .catch(reject);
                }
            );
        });
    },
    
    // --------------------------------------------------------------------------
    // Atualiza fornecedor (parcial)
    // --------------------------------------------------------------------------
    update(id: number, input: EntradaAtualizarFornecedor): Promise<Fornecedor | null> {
        return new Promise((resolve, reject) => {
            const fields: string[] = [];
            const values: unknown[] = [];

            if (input.nome !== undefined) {
                fields.push("nome = ?");
                values.push(input.nome)
            }
            if (input.cnpj !== undefined) {
                fields.push("cnpj = ?");
                values.push(input.cnpj)
            }
            if (input.endereco !== undefined) {
                fields.push("endereco = ?");
                values.push(input.endereco)
            }
            if (input.tempo_entrega !== undefined) {
                fields.push("tempo_entrega = ?");
                values.push(input.tempo_entrega)
            }

            if (fields.length === 0) {
                return fornecedorRepository.findByID(id).then(resolve).catch(reject);
            }

            values.push(id);
            const sql = `UPDATE fornecedor SET ${fields.join(", ")} WHERE id_fornecedor = ?`;

            db.run(sql, values, (err: Error | null) => {
                if (err) return reject(err);
                fornecedorRepository.findByID(id).then(resolve).catch(reject);
            });
        });
    },
    
    // --------------------------------------------------------------------------
    // Deleta fornecedor. Retorna true se removeu, false se não existia.
    // --------------------------------------------------------------------------
    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM fornecedor WHERE id_fornecedor = ?",
                [id],
                function (this: sqlite3.RunResult, err: Error | null) {
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    },
    
    // --------------------------------------------------------------------------
    // Retorna fornecedor completo (com emails e telefones)
    // --------------------------------------------------------------------------
    findCompleteByID(id: number): Promise<FornecedorCompleto | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const fornecedor = await fornecedorRepository.findByID(id);
                if (!fornecedor) return resolve(null);
    
                const emails = await new Promise<string[]>((res, rej) => {
                db.all(
                    "SELECT email FROM email_fornecedor WHERE id_fornecedor = ?",
                    [id],
                    (err, rows) => {
                        if (err) rej(err);
                        else res(rows.map((r: any) => r.email));
                    }
                );
            });
    
            const telefones = await new Promise<string[]>((res, rej) => {
                db.all(
                    "SELECT telefone FROM telefone_fornecedor WHERE id_fornecedor = ?",
                    [id],
                    (err, rows) => {
                        if (err) rej(err);
                        else res(rows.map((r: any) => r.telefone));
                    }
                );
            });
                resolve({ ...fornecedor, emails, telefones });
            } catch (err) {
                reject(err);
            }
        });
    },
}