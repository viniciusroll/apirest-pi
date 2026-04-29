# API REST - Sistema de Pedidos para Loja de Bebidas

API REST desenvolvida em TypeScript + Node.js + Express para gerenciamento de pedidos, clientes, produtos e relatorios de uma loja de bebidas.

## Tecnologias

- TypeScript
- Node.js
- Express
- Zod (validacoes)
- Prisma (ORM)
- SQLite (banco de dados)
- JWT (autenticacao)

## Como executar

1. Clone o repositorio
2. Instale as dependencias: `npm install`
3. Copie `.env.example` para `.env` e preencha as variaveis
4. Rode o projeto: `npm run dev`
5. Acesse http://localhost:3000

## Estrutura do projeto
src/
├── config/         # Configuracoes (env, database)
├── controllers/    # Controladores das rotas
├── middleware/     # Middlewares (auth, validacao, erros)
├── models/         # Modelos de dados
├── repositories/   # Acesso ao banco
├── routes/         # Definicao das rotas
├── schemas/        # Schemas de validacao Zod
├── services/       # Regras de negocio
├── types/          # Tipos TypeScript
└── utils/          # Funcoes auxiliares
## Equipe

- (Adicionar nomes dos integrantes)
