# API REST — Sistema de Pedidos para Loja de Bebidas

API REST em **TypeScript + Node.js + Express** para gerenciar clientes, fornecedores, produtos, pedidos e relatórios de uma loja de bebidas. Projeto Integrador (PI) — 2º semestre.

## Tecnologias

| Camada | Ferramenta |
|---|---|
| Linguagem | TypeScript |
| Runtime | Node.js |
| Framework HTTP | Express |
| Banco de dados | SQLite (`sqlite3`) |
| Validação | Zod |
| Autenticação | JWT (`jsonwebtoken`) |
| Hash de senha | bcryptjs |
| Dev runner | tsx |

## Pré-requisitos

- Node.js 18+
- npm

## Como executar

```bash
# 1. Instalar dependências
npm install

# 2. Copiar .env de exemplo
cp .env.example .env

# 3. Inicializar o banco SQLite (cria database.db na raiz)
npm run db:init

# 4. Rodar em modo desenvolvimento (hot reload via tsx)
npm run dev
```

Servidor em http://localhost:3000

### Scripts disponíveis

| Script | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor com `tsx watch src/server.ts` |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a build (`node dist/server.js`) |
| `npm run db:init` | Aplica `src/database/schema.sql` em `database.db` |
| `npm run db:seed` | Popula o banco com dados de exemplo |

## Variáveis de ambiente (`.env`)

| Variável | Descrição | Default |
|---|---|---|
| `PORT` | Porta do servidor HTTP | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `DATABASE_URL` | Caminho do arquivo SQLite | `file:./database.db` |
| `JWT_SECRET` | Segredo para assinar JWTs | — (obrigatório) |
| `JWT_EXPIRES_IN` | Validade do token | `24h` |
| `BCRYPT_SALT_ROUNDS` | Cost factor do bcrypt | `10` |

## Estrutura do projeto

```
apirest-pi/
├── docs/
│   ├── diagramas/
│   │   └── der.png                  # Diagrama Entidade-Relacionamento
│   └── relatorios/
│       └── entrevista01.md          # Relatório do cliente / requisitos
├── src/
│   ├── config/                      # env e conexão com banco (db)
│   ├── controllers/                 # Camada HTTP (req/res)
│   ├── database/
│   │   ├── schema.sql               # DDL do banco
│   │   ├── init.ts                  # Script de inicialização
│   │   └── seed.ts                  # Dados de exemplo
│   ├── middleware/                  # auth, validação, erros
│   ├── models/                      # Interfaces TypeScript das entidades
│   ├── repositories/                # Acesso ao banco (SQL)
│   ├── routes/                      # Definição das rotas Express
│   ├── schemas/                     # Schemas Zod (validação de input)
│   ├── services/                    # Regras de negócio
│   ├── types/                       # Tipos auxiliares
│   ├── utils/                       # logger, helpers
│   ├── app.ts                       # Configuração do Express
│   └── server.ts                    # Bootstrap do servidor
├── .env.example
├── package.json
├── requests.http                    # Exemplos de requisições (REST Client)
└── tsconfig.json
```

### Arquitetura em camadas

```
Routes  ─►  Controllers  ─►  Services  ─►  Repositories  ─►  SQLite
                ▲              ▲
              schemas        models (tipos)
              (Zod)
```

- **Models** descrevem o formato dos dados (sem lógica).
- **Repositories** isolam o SQL e devolvem objetos tipados.
- **Services** aplicam as regras de negócio (RN01–RN07).
- **Controllers** recebem o `req`, chamam o serviço e devolvem JSON.
- **Schemas Zod** validam o input antes de chegar no controller.
- **Middlewares** centralizam autenticação JWT, validação e tratamento de erros.

## Modelo de dados

Diagrama em [docs/diagramas/der.png](docs/diagramas/der.png).

| Tabela | Função |
|---|---|
| `cliente` | Clientes da loja (CPF, endereço) |
| `email_cliente` / `telefone_cliente` | Atributos multivalorados do cliente |
| `fornecedor` | Fornecedores dos produtos (CNPJ, `tempo_entrega`) |
| `email_fornecedor` / `telefone_fornecedor` | Atributos multivalorados do fornecedor |
| `produto` | Produtos à venda (preço, estoque, validade, categoria) |
| `pedido` | Vendas: `id_usuario`, `forma_pagamento`, `status`, `total_pedido` |
| `item_pedido` | Itens de cada pedido (`preco_unitario` congelado) |
| `movimento_estoque` | Movimentações de entrada/saída de estoque |
| `usuario` | Funcionários autorizados a logar (RF13) |

### Convenções

- `forma_pagamento ∈ { DINHEIRO, CARTAO, PIX, FIADO }`
- `status ∈ { PENDENTE, PAGO, CANCELADO }` — `PENDENTE + FIADO` = cliente em débito (RF10/RN06)
- `preco_unitario` em `item_pedido` é **congelado** no momento da venda (mudanças no preço do produto não afetam pedidos antigos)
- `total_pedido` é calculado pelo service a partir dos itens (RN02)
- `movimento_estoque` registra toda entrada/saída — tipo `SAIDA` ao criar pedido, `ENTRADA` para reposição manual
- `pedido.id_usuario` vincula o funcionário que registrou a venda

## Requisitos atendidos

Detalhes em [docs/relatorios/entrevista01.md](docs/relatorios/entrevista01.md).

| Tipo | IDs cobertos |
|---|---|
| Funcionais | RF01 – RF13 |
| Regras de Negócio | RN01 – RN07 |
| Não Funcionais | RNF01 – RNF08 |

## Endpoints da API

Base URL: `http://localhost:3000`

### Autenticação (`/auth`) — público

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/registrar` | Cria usuário |
| POST | `/auth/login` | Retorna JWT |

### Clientes (`/clientes`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/clientes` | Listar todos |
| GET | `/clientes/:id` | Buscar por ID |
| POST | `/clientes` | Criar cliente |
| PUT | `/clientes/:id` | Atualizar (parcial) |
| DELETE | `/clientes/:id` | Remover |
| GET | `/clientes/:id/pedidos` | Pedidos do cliente |

### Fornecedores (`/fornecedores`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/fornecedores` | Listar todos |
| GET | `/fornecedores/:id` | Buscar por ID |
| POST | `/fornecedores` | Criar fornecedor |
| PUT | `/fornecedores/:id` | Atualizar (parcial) |
| DELETE | `/fornecedores/:id` | Remover |

### Produtos (`/produtos`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Listar todos |
| GET | `/produtos/:id` | Buscar por ID |
| POST | `/produtos` | Criar produto |
| PUT | `/produtos/:id` | Atualizar (parcial) |
| DELETE | `/produtos/:id` | Remover |

### Pedidos (`/pedidos`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/pedidos` | ✅ JWT | Criar pedido |
| GET | `/pedidos/:id` | | Buscar por ID |
| PUT | `/pedidos/:id` | | Atualizar status/pagamento |
| DELETE | `/pedidos/:id` | | Excluir pedido |

### Movimentos de Estoque (`/movimentos-estoque`) — todos autenticados

| Método | Rota | Descrição |
|---|---|---|
| POST | `/movimentos-estoque` | Registrar entrada/saída |
| GET | `/movimentos-estoque` | Listar todos |
| GET | `/movimentos-estoque/produto/:id_produto` | Listar por produto |

### Relatórios (`/relatorios`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/relatorios/inadimplentes` | Clientes em débito |
| GET | `/relatorios/vendas?inicio=&fim=` | Vendas por período |
| GET | `/relatorios/produtos-mais-vendidos?limite=` | Top produtos |
| GET | `/relatorios/estoque-baixo?limite=` | Estoque crítico |

## Documentação

- [Relatório de requisitos](docs/relatorios/entrevista01.md)
- [DER (PNG)](docs/diagramas/der.png)

## Equipe
Gabriel Verdin
Leonardo Xu
Leonardo Tagliamento
Thiago Freri
Vinicius Rodrigo
Willian Pontieri
Projeto Integrador — Fatec, 2º semestre.