import { fornecedorRepository as repo} from "../repositories/fornecedor.repository";
import { 
    EntradaCriarFornecedor,
    EntradaAtualizarFornecedor, 
    FornecedorCompleto
} from "../models/fornecedor.model";

export async function criarFornecedor(
    dados: EntradaCriarFornecedor & { emails: string[], telefones: string[] }
): Promise<FornecedorCompleto> {
    const existente = await repo.findByCNPJ(dados.cnpj);
    if (existente) {
        throw new Error("Já existe um fornecedor com esse CNPJ.");
    }

    return repo.create(dados, dados.emails, dados.telefones);
}