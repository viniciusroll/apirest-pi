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