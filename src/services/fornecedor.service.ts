import { fornecedorRepository as repo} from "../repositories/fornecedor.repository";
import { 
    EntradaCriarFornecedor,
    EntradaAtualizarFornecedor, 
    FornecedorCompleto
} from "../models/fornecedor.model";

// Cria o fornecedor.
export async function criarFornecedor(
    dados: EntradaCriarFornecedor & { emails: string[], telefones: string[] }
): Promise<FornecedorCompleto> {
    const existente = await repo.findByCNPJ(dados.cnpj);
    if (existente) {
        throw new Error("Já existe um fornecedor com esse CNPJ.");
    }

    return repo.create(dados, dados.emails, dados.telefones);
}

// Lista todos os fornecedores.
export async function listarFornecedores() {
    return repo.findAll();
}

// Busca o fornecedor por ID.
export async function buscarFornecedorPorID(id: number) {
    return repo.findCompleteByID(id);
}

// Atualiza o fornecedor.
export async function atualizarFornecedor(id: number, dados: EntradaAtualizarFornecedor) {
    return repo.update(id, dados);
}

// Exclui o fornecedor.
export async function excluirFornecedor(id: number) {
    return repo.delete(id);
}
