import { sqlite3 } from "sqlite3";
import { db } from "../config/database";
import { 
    Fornecedor, 
    EmailFornecedor, 
    TelefoneFornecedor,
    FornecedorCompleto
} from "../models/fornecedor.model";

export const fornecedorRepository = {
    // --------------------------------------------------------------------------
    // Lista TODOS os fornecedores
    // --------------------------------------------------------------------------
    findAll(): Promise<Fornecedor[]> {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM fornecedor ORDER BY id_fornecedor;", (err, rows) => {
                if (err) reject(err);
                else resolve(rows as Fornecedor[])
            });
        });
    }
}