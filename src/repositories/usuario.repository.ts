import sqlite3 from "sqlite3";
import { db } from "../config/database";
import { Usuario } from "../models/usuario.model";

export const usuarioRepository = {
  findByEmail(email: string): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM usuario WHERE email = ?",
        [email],
        (err: Error | null, row: Usuario | undefined) => {
          if (err) reject(err);
          else resolve(row ?? null);
        }
      );
    });
  },

  findById(id: number): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM usuario WHERE id_usuario = ?",
        [id],
        (err: Error | null, row: Usuario | undefined) => {
          if (err) reject(err);
          else resolve(row ?? null);
        }
      );
    });
  },

  create(nome: string, email: string, senha_hash: string, papel: string): Promise<Usuario> {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO usuario (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)",
        [nome, email, senha_hash, papel],
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) return reject(err);
          usuarioRepository.findById(this.lastID).then((u) => resolve(u!)).catch(reject);
        }
      );
    });
  },
};