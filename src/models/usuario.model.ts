export interface Usuario {
    id_usuario: number;
    nome: string;
    email: string;
    senha_hash: string;
    papel: string;
    criado_em: string;
    atualizado_em: string;
}

export type EntradaCriarUsuario = Omit<Usuario, "id_usuario" | "criado_em" | "atualizado_em">;
export type EntradaAtualizarUsuario = Partial<EntradaCriarUsuario>;