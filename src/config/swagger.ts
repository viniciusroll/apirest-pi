import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Loja de Bebidas",
      version: "1.0.0",
      description: "API REST para sistema de pedidos de loja de bebidas — Projeto Integrador FATEC Indaiatuba",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Auth", description: "Autenticação e gerenciamento de usuários" },
      { name: "Produtos", description: "CRUD de produtos" },
      { name: "Clientes", description: "CRUD de clientes" },
      { name: "Fornecedores", description: "CRUD de fornecedores" },
      { name: "Pedidos", description: "CRUD de pedidos" },
      { name: "Movimentos de Estoque", description: "Controle de estoque" },
      { name: "Relatórios", description: "Relatórios gerenciais" },
    ],
    paths: {
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Autenticar usuário",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "senha"],
                  properties: {
                    email: { type: "string", example: "admin@bebidas.com" },
                    senha: { type: "string", example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login realizado com sucesso, retorna token JWT" },
            401: { description: "E-mail ou senha inválidos" },
          },
        },
      },
      "/auth/registrar": {
        post: {
          tags: ["Auth"],
          summary: "Registrar novo usuário",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nome", "email", "senha"],
                  properties: {
                    nome: { type: "string", example: "João Silva" },
                    email: { type: "string", example: "joao@bebidas.com" },
                    senha: { type: "string", example: "123456" },
                    papel: { type: "string", example: "FUNCIONARIO", enum: ["ADMIN", "FUNCIONARIO"] },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Usuário criado com sucesso" },
            409: { description: "E-mail já cadastrado" },
          },
        },
      },
      "/auth/alterar-senha": {
        post: {
          tags: ["Auth"],
          summary: "Alterar senha do usuário autenticado",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["senha_atual", "nova_senha"],
                  properties: {
                    senha_atual: { type: "string", example: "123456" },
                    nova_senha: { type: "string", example: "novaSenha123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Senha alterada com sucesso" },
            401: { description: "Senha atual incorreta" },
          },
        },
      },
      "/produtos": {
        get: {
          tags: ["Produtos"],
          summary: "Listar todos os produtos",
          responses: { 200: { description: "Lista de produtos" } },
        },
        post: {
          tags: ["Produtos"],
          summary: "Criar novo produto",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nome", "preco", "estoque"],
                  properties: {
                    nome: { type: "string", example: "Cerveja Lager 350ml" },
                    descricao: { type: "string", example: "Cerveja gelada" },
                    preco: { type: "number", example: 5.5 },
                    estoque: { type: "integer", example: 100 },
                    id_fornecedor: { type: "integer", example: 1 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Produto criado" } },
        },
      },
      "/produtos/{id}": {
        get: {
          tags: ["Produtos"],
          summary: "Buscar produto por ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Produto encontrado" }, 404: { description: "Produto não encontrado" } },
        },
        put: {
          tags: ["Produtos"],
          summary: "Atualizar produto",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    descricao: { type: "string" },
                    preco: { type: "number" },
                    estoque: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Produto atualizado" } },
        },
        delete: {
          tags: ["Produtos"],
          summary: "Remover produto",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Produto removido" } },
        },
      },
      "/clientes": {
        get: {
          tags: ["Clientes"],
          summary: "Listar todos os clientes",
          responses: { 200: { description: "Lista de clientes" } },
        },
        post: {
          tags: ["Clientes"],
          summary: "Criar novo cliente",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nome"],
                  properties: {
                    nome: { type: "string", example: "Maria Souza" },
                    telefone: { type: "string", example: "(11) 99999-9999" },
                    email: { type: "string", example: "maria@email.com" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Cliente criado" } },
        },
      },
      "/clientes/{id}": {
        get: {
          tags: ["Clientes"],
          summary: "Buscar cliente por ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Cliente encontrado" }, 404: { description: "Não encontrado" } },
        },
        put: {
          tags: ["Clientes"],
          summary: "Atualizar cliente",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    telefone: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Cliente atualizado" } },
        },
        delete: {
          tags: ["Clientes"],
          summary: "Remover cliente",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Cliente removido" } },
        },
      },
      "/clientes/{id}/pedidos": {
        get: {
          tags: ["Clientes"],
          summary: "Listar pedidos de um cliente",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Lista de pedidos do cliente" } },
        },
      },
      "/fornecedores": {
        get: {
          tags: ["Fornecedores"],
          summary: "Listar todos os fornecedores",
          responses: { 200: { description: "Lista de fornecedores" } },
        },
        post: {
          tags: ["Fornecedores"],
          summary: "Criar novo fornecedor",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["nome"],
                  properties: {
                    nome: { type: "string", example: "Distribuidora ABC" },
                    telefone: { type: "string", example: "(11) 3333-3333" },
                    email: { type: "string", example: "contato@abc.com" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Fornecedor criado" } },
        },
      },
      "/fornecedores/{id}": {
        get: {
          tags: ["Fornecedores"],
          summary: "Buscar fornecedor por ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Fornecedor encontrado" }, 404: { description: "Não encontrado" } },
        },
        put: {
          tags: ["Fornecedores"],
          summary: "Atualizar fornecedor",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    telefone: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Fornecedor atualizado" } },
        },
        delete: {
          tags: ["Fornecedores"],
          summary: "Remover fornecedor",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Fornecedor removido" } },
        },
      },
      "/pedidos": {
        get: {
          tags: ["Pedidos"],
          summary: "Listar todos os pedidos",
          responses: { 200: { description: "Lista de pedidos" } },
        },
        post: {
          tags: ["Pedidos"],
          summary: "Criar novo pedido",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id_cliente", "itens"],
                  properties: {
                    id_cliente: { type: "integer", example: 1 },
                    forma_pagamento: { type: "string", example: "DINHEIRO", enum: ["DINHEIRO", "CARTAO", "PIX", "FIADO"] },
                    itens: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id_produto: { type: "integer", example: 1 },
                          quantidade: { type: "integer", example: 2 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Pedido criado" } },
        },
      },
      "/pedidos/{id}": {
        get: {
          tags: ["Pedidos"],
          summary: "Buscar pedido por ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Pedido encontrado" }, 404: { description: "Não encontrado" } },
        },
        put: {
          tags: ["Pedidos"],
          summary: "Atualizar pedido",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "CONCLUIDO", enum: ["PENDENTE", "CONCLUIDO", "CANCELADO"] },
                    forma_pagamento: { type: "string", example: "PIX" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Pedido atualizado" } },
        },
        delete: {
          tags: ["Pedidos"],
          summary: "Remover pedido",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Pedido removido" } },
        },
      },
      "/movimentos-estoque": {
        get: {
          tags: ["Movimentos de Estoque"],
          summary: "Listar todos os movimentos",
          responses: { 200: { description: "Lista de movimentos" } },
        },
        post: {
          tags: ["Movimentos de Estoque"],
          summary: "Registrar movimento de estoque",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["id_produto", "tipo", "quantidade"],
                  properties: {
                    id_produto: { type: "integer", example: 1 },
                    tipo: { type: "string", example: "ENTRADA", enum: ["ENTRADA", "SAIDA"] },
                    quantidade: { type: "integer", example: 50 },
                    observacao: { type: "string", example: "Reposição de estoque" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Movimento registrado" } },
        },
      },
      "/movimentos-estoque/produto/{id_produto}": {
        get: {
          tags: ["Movimentos de Estoque"],
          summary: "Listar movimentos por produto",
          parameters: [{ name: "id_produto", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Movimentos do produto" } },
        },
      },
      "/relatorios/inadimplentes": {
        get: {
          tags: ["Relatórios"],
          summary: "Clientes inadimplentes",
          responses: { 200: { description: "Lista de clientes inadimplentes com valor em aberto" } },
        },
      },
      "/relatorios/vendas": {
        get: {
          tags: ["Relatórios"],
          summary: "Vendas por período",
          parameters: [
            { name: "inicio", in: "query", schema: { type: "string", example: "2024-01-01" } },
            { name: "fim", in: "query", schema: { type: "string", example: "2024-12-31" } },
          ],
          responses: { 200: { description: "Total de pedidos e receita no período" } },
        },
      },
      "/relatorios/produtos-mais-vendidos": {
        get: {
          tags: ["Relatórios"],
          summary: "Produtos mais vendidos",
          parameters: [{ name: "limite", in: "query", schema: { type: "integer", example: 10 } }],
          responses: { 200: { description: "Ranking de produtos por quantidade vendida" } },
        },
      },
      "/relatorios/estoque-baixo": {
        get: {
          tags: ["Relatórios"],
          summary: "Produtos com estoque baixo",
          parameters: [{ name: "limite", in: "query", schema: { type: "integer", example: 10 } }],
          responses: { 200: { description: "Produtos abaixo do limite de estoque" } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}