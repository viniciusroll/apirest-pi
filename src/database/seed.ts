import { db } from "../config/database";

const SENHA_HASH = "$2a$10$ricwBsTk.KczOfPgfTkmY..AkIJui4uZAfGyCSld53y615sZicQza"; // hash de "senha123"

function run(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function seedDatabase() {
  try {
    // Desabilita foreign keys temporariamente durante o seed
    await run("PRAGMA foreign_keys = OFF;");

    // Dropa tabelas na ordem inversa de dependência
    await run("DROP TABLE IF EXISTS movimento_estoque;");
    await run("DROP TABLE IF EXISTS item_pedido;");
    await run("DROP TABLE IF EXISTS pedido;");
    await run("DROP TABLE IF EXISTS produto;");
    await run("DROP TABLE IF EXISTS email_fornecedor;");
    await run("DROP TABLE IF EXISTS telefone_fornecedor;");
    await run("DROP TABLE IF EXISTS fornecedor;");
    await run("DROP TABLE IF EXISTS email_cliente;");
    await run("DROP TABLE IF EXISTS telefone_cliente;");
    await run("DROP TABLE IF EXISTS cliente;");
    await run("DROP TABLE IF EXISTS usuario;");

    // ===== Recria todas as tabelas =====
    // Tabela usuario
    await run(`CREATE TABLE usuario (
      id_usuario     INTEGER PRIMARY KEY AUTOINCREMENT,
      nome           VARCHAR(100) NOT NULL,
      email          VARCHAR(150) NOT NULL UNIQUE,
      senha_hash     VARCHAR(255) NOT NULL,
      papel          VARCHAR(20) NOT NULL DEFAULT 'FUNCIONARIO',
      criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);

    // Tabela fornecedor
    await run(`CREATE TABLE fornecedor (
      id_fornecedor   INTEGER PRIMARY KEY AUTOINCREMENT,
      nome            VARCHAR(100) NOT NULL,
      cnpj            CHAR(14) NOT NULL UNIQUE,
      endereco        VARCHAR(200),
      tempo_entrega   INTEGER CHECK (tempo_entrega IS NULL OR tempo_entrega >= 0),
      criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em   DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);

    // Tabela email_fornecedor
    await run(`CREATE TABLE email_fornecedor (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      id_fornecedor   INTEGER NOT NULL,
      email           VARCHAR(150) NOT NULL,
      UNIQUE (id_fornecedor, email),
      FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
    );`);

    // Tabela telefone_fornecedor
    await run(`CREATE TABLE telefone_fornecedor (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      id_fornecedor   INTEGER NOT NULL,
      telefone        VARCHAR(15) NOT NULL,
      UNIQUE (id_fornecedor, telefone),
      FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
    );`);

    // Tabela produto
    await run(`CREATE TABLE produto (
      id_produto         INTEGER PRIMARY KEY AUTOINCREMENT,
      nome               VARCHAR(100) NOT NULL,
      preco              REAL    NOT NULL CHECK (preco > 0),
      estoque            INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
      validade           DATE,
      categoria          VARCHAR(50),
      id_fornecedor      INTEGER,
      criado_em          DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE SET NULL
    );`);

    // Tabela cliente
    await run(`CREATE TABLE cliente (
      id_cliente     INTEGER PRIMARY KEY AUTOINCREMENT,
      nome           VARCHAR(100) NOT NULL,
      cpf            CHAR(11) NOT NULL UNIQUE,
      endereco       VARCHAR(200),
      criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);

    // Tabela email_cliente
    await run(`CREATE TABLE email_cliente (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cliente   INTEGER NOT NULL,
      email        VARCHAR(150) NOT NULL,
      UNIQUE (id_cliente, email),
      FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
    );`);

    // Tabela telefone_cliente
    await run(`CREATE TABLE telefone_cliente (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cliente   INTEGER NOT NULL,
      telefone     VARCHAR(15) NOT NULL,
      UNIQUE (id_cliente, telefone),
      FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
    );`);

    // Tabela pedido
    await run(`CREATE TABLE pedido (
      id_pedido       INTEGER PRIMARY KEY AUTOINCREMENT,
      id_cliente      INTEGER NOT NULL,
      id_usuario      INTEGER NOT NULL,
      data_pedido     DATETIME DEFAULT CURRENT_TIMESTAMP,
      status          VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
      forma_pagamento VARCHAR(50),
      total_pedido           REAL NOT NULL DEFAULT 0,
      criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em   DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
      FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    );`);

    // Tabela item_pedido
    await run(`CREATE TABLE item_pedido (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pedido         INTEGER NOT NULL,
      id_produto        INTEGER NOT NULL,
      quantidade        INTEGER NOT NULL CHECK (quantidade > 0),
      preco_unitario    REAL NOT NULL CHECK (preco_unitario > 0),
      FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
      FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
    );`);

    // Tabela movimento_estoque
    await run(`CREATE TABLE movimento_estoque (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      id_produto   INTEGER NOT NULL,
      tipo         VARCHAR(20) NOT NULL,
      quantidade   INTEGER NOT NULL,
      descricao    VARCHAR(200),
      criado_em    DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
    );`);

    // --- Usuários ---
    await run(
      "INSERT INTO usuario (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)",
      ["Administrador", "admin@loja.com", SENHA_HASH, "ADMIN"]
    );
    await run(
      "INSERT INTO usuario (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)",
      ["Gerente", "gerente@loja.com", SENHA_HASH, "GERENTE"]
    );

    // --- Fornecedores ---
    await run(
      "INSERT INTO fornecedor (nome, cnpj, endereco, tempo_entrega) VALUES (?, ?, ?, ?)",
      ["Distribuidora Bebidas Sul", "12345678000190", "Rua das Industrias, 500 - Campinas/SP", 3]
    );
    await run(
      "INSERT INTO fornecedor (nome, cnpj, endereco, tempo_entrega) VALUES (?, ?, ?, ?)",
      ["Atacado Gelado", "98765432000110", "Av. Logistica, 1200 - Jundiai/SP", 5]
    );

    // Emails e telefones do fornecedor 1
    await run("INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (1, ?)", ["contato@bebidasul.com"]);
    await run("INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (1, ?)", ["vendas@bebidasul.com"]);
    await run("INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (1, ?)", ["19999990001"]);
    await run("INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (1, ?)", ["1932320001"]);

    // Emails e telefones do fornecedor 2
    await run("INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (2, ?)", ["atacado@gelado.com"]);
    await run("INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (2, ?)", ["11988880001"]);

    // --- Produtos ---
    await run(
      "INSERT INTO produto (nome, preco, estoque, validade, categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)",
      ["Skol Lata 350ml", 3.50, 100, "2026-12-31", "CERVEJA", 1]
    );
    await run(
      "INSERT INTO produto (nome, preco, estoque, validade, categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)",
      ["Coca-Cola 2L", 10.90, 50, "2026-10-15", "REFRIGERANTE", 1]
    );
    await run(
      "INSERT INTO produto (nome, preco, estoque, validade, categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)",
      ["Absolut Vodka 1L", 89.90, 20, "2028-06-01", "DESTILADO", 2]
    );

    // --- Clientes ---
    await run(
      "INSERT INTO cliente (nome, cpf, endereco) VALUES (?, ?, ?)",
      ["Maria Silva", "12345678901", "Rua das Flores, 123 - Sorocaba/SP"]
    );
    await run(
      "INSERT INTO cliente (nome, cpf, endereco) VALUES (?, ?, ?)",
      ["Joao Pereira", "98765432100", "Av. Brasil, 456 - Sorocaba/SP"]
    );

    // Emails e telefones do cliente 1
    await run("INSERT INTO email_cliente (id_cliente, email) VALUES (1, ?)", ["maria@email.com"]);
    await run("INSERT INTO email_cliente (id_cliente, email) VALUES (1, ?)", ["maria.silva@trabalho.com"]);
    await run("INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (1, ?)", ["15999990001"]);

    // Emails e telefones do cliente 2
    await run("INSERT INTO email_cliente (id_cliente, email) VALUES (2, ?)", ["joao@email.com"]);
    await run("INSERT INTO email_cliente (id_cliente, email) VALUES (2, ?)", ["joao.pessoal@email.com"]);
    await run("INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (2, ?)", ["15999990002"]);
    await run("INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (2, ?)", ["1533330002"]);

    // Reabilita foreign keys
    await run("PRAGMA foreign_keys = ON;");

    console.log("\n✅ Seed executado com sucesso!");
    console.log("   - 2 usuários");
    console.log("   - 2 fornecedores");
    console.log("   - 3 produtos");
    console.log("   - 2 clientes");
    
    db.close();
  } catch (err) {
    console.error("\n❌ Erro ao executar seed:", err);
    db.close();
    process.exit(1);
  }
}

seedDatabase();
