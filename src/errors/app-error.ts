/* 
Quando um Service precisa interromper o fluxo com uma mensagem,
ele lança um AppError. O middleware de erro captura esse erro
e retorna a resposta HTTP apropriada.
*/
export class AppError extends Error {
    constructor(public message: string, public statusCode = 400) {
        super(message);
    }
}