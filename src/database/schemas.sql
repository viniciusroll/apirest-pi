-- ============================================================================
-- schema.sql — estrutura do banco de dados (SQL puro)
-- ============================================================================
-- As tabelas serao adicionadas nos proximos commits, uma por uma:
--   1. clients      — clientes da loja
--   2. users        — fornecedores da loja
--   3. users        — funcionarios do sistema (RF13, RNF04)
--   4. products     — produtos a venda
--   5. orders       — pedidos (vendas)
--   6. order_items  — itens dentro de cada pedido
-- ============================================================================

-- =====================================================
-- Tabela: cliente
-- Representa a entidade "cliente" do DER.
-- Atributos multivalorados (email, telefone) ficam em
-- tabelas separadas: email_cliente e telefone_cliente.
-- =====================================================
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome         TEXT NOT NULL,
  cpf          TEXT NOT NULL UNIQUE,
  endereco     TEXT,
  criado_em    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_cliente (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  id_cliente   INTEGER NOT NULL,
  email        TEXT NOT NULL,
  UNIQUE (id_cliente, email),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telefone_cliente (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  id_cliente   INTEGER NOT NULL,
  telefone     TEXT NOT NULL,
  UNIQUE (id_cliente, telefone),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_cliente    ON email_cliente(id_cliente);
CREATE INDEX IF NOT EXISTS idx_telefone_cliente ON telefone_cliente(id_cliente);

-- =====================================================
-- Tabela: fornecedor
-- Representa a entidade "fornecedor" do DER.
-- Atributos multivalorados (email, telefone) ficam em
-- tabelas separadas: email_fornecedor e telefone_fornecedor.
-- =====================================================
CREATE TABLE IF NOT EXISTS fornecedor (
  id_fornecedor   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome            TEXT NOT NULL,
  cnpj            TEXT NOT NULL UNIQUE,
  endereco        TEXT,
  lead_time       INTEGER CHECK (lead_time IS NULL OR lead_time >= 0),
  criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_fornecedor (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  id_fornecedor   INTEGER NOT NULL,
  email           TEXT NOT NULL,
  UNIQUE (id_fornecedor, email),
  FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telefone_fornecedor (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  id_fornecedor   INTEGER NOT NULL,
  telefone        TEXT NOT NULL,
  UNIQUE (id_fornecedor, telefone),
  FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_email_fornecedor    ON email_fornecedor(id_fornecedor);
CREATE INDEX IF NOT EXISTS idx_telefone_fornecedor ON telefone_fornecedor(id_fornecedor);
