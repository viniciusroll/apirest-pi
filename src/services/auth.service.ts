import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { usuarioRepository } from "../repositories/usuario.repository";
import { AppError } from "../errors/app-error";
import { env } from "../config/env";

export const authService = {
  async login(email: string, senha: string) {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) throw new AppError("E-mail ou senha inválidos", 401);

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) throw new AppError("E-mail ou senha inválidos", 401);

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email, papel: usuario.papel },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    };
  },

  async registrar(nome: string, email: string, senha: string, papel: string = "FUNCIONARIO") {
    const existe = await usuarioRepository.findByEmail(email);
    if (existe) throw new AppError("E-mail já cadastrado", 409);

    const senha_hash = await bcrypt.hash(senha, env.BCRYPT_SALT_ROUNDS);
    const usuario = await usuarioRepository.create(nome, email, senha_hash, papel);

    return {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    };
  },
};