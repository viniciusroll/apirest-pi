import { sqlite3 } from "sqlite3";
import { db } from "../config/database";
import { 
    Fornecedor, 
    EmailFornecedor, 
    TelefoneFornecedor,
    EntradaCriarFornecedor,
    EntradaAtualizarFornecedor,
    FornecedorCompleto
} from "../models/fornecedor.model";
import { resolve } from "path";

export const fornecedorRepository = {

    // --------------------------------------------------------------------------
    // Lista TODOS os fornecedores
    // --------------------------------------------------------------------------
    findAll(): Promise<Fornecedor[]> {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM fornecedor ORDER BY id_fornecedor;", (err, rows) => {
                if (err) reject(err);
                else resolve(rows as Fornecedor[]);
            });
        });
    },
    
    // --------------------------------------------------------------------------
    // Busca cliente por ID
    // --------------------------------------------------------------------------
    findByID(id: number): Promise<Fornecedor | null> {
        return new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM fornecedores WHERE id_fornecedor = ?;",
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
    }
}