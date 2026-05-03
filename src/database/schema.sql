-- ============================================================================
-- schema.sql — estrutura do banco de dados (SQL puro, dialeto SQLite)
-- ============================================================================
-- Tabelas do sistema (alinhadas ao DER em docs/diagramas/der.png):
--   1. cliente              — clientes da loja
--      + email_cliente / telefone_cliente   (atributos multivalorados)
--   2. fornecedor           — fornecedores dos produtos
--      + email_fornecedor / telefone_fornecedor (atributos multivalorados)
--   3. usuario              — funcionarios que logam no sistema (RF13, RNF04)
--   4. produto              — produtos a venda
--      + categoria_produto                  (atributo multivalorado)
--   5. pedido               — pedidos (vendas) realizadas por um cliente
--   6. item_pedido          — itens dentro de cada pedido (resolve N:N)
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

-- =====================================================
-- Tabela: usuario (RF13, RNF04)
-- Funcionarios que fazem LOGIN no sistema.
-- NAO confundir com cliente (cliente da loja, nao loga).
-- =====================================================
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario     INTEGER PRIMARY KEY AUTOINCREMENT,
  nome           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  senha_hash     TEXT NOT NULL,
  papel          TEXT NOT NULL DEFAULT 'FUNCIONARIO',
  criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar 'atualizado_em' em qualquer UPDATE
-- (SQLite nao tem 'ON UPDATE CURRENT_TIMESTAMP' como o MySQL)
CREATE TRIGGER IF NOT EXISTS usuario_atualizado_em
AFTER UPDATE ON usuario
FOR EACH ROW
BEGIN
  UPDATE usuario SET atualizado_em = CURRENT_TIMESTAMP WHERE id_usuario = OLD.id_usuario;
END;

CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario(email);

-- =====================================================
-- Tabela: produto
-- Produtos disponiveis para venda (PDF secao 4).
-- =====================================================
CREATE TABLE IF NOT EXISTS produto (
  id_produto         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome               TEXT    NOT NULL,
  preco              REAL    NOT NULL CHECK (preco > 0),
  estoque            INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  validade           DATE,
  categoria          TEXT,
  id_fornecedor      INTEGER,
  criado_em          DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE SET NULL
);

-- Trigger para atualizar 'atualizado_em' em qualquer UPDATE
CREATE TRIGGER IF NOT EXISTS produto_atualizado_em
AFTER UPDATE ON produto
FOR EACH ROW
BEGIN
  UPDATE produto SET atualizado_em = CURRENT_TIMESTAMP WHERE id_produto = OLD.id_produto;
END;

CREATE INDEX IF NOT EXISTS idx_produto_categoria        ON produto(categoria);

-- =====================================================
-- Tabela: pedido
-- Vendas realizadas (RF03).
-- Vinculada a UM cliente (RN03).
-- total_pedido sera calculado pelo service (RN02).
-- status PENDENTE em pedidos FIADO indica cliente em debito
-- (RF10/RN06). Quando o cliente quita, vira PAGO.
-- status CANCELADO permite cancelar pedidos (RF12).
-- =====================================================
CREATE TABLE IF NOT EXISTS pedido (
  id_pedido         INTEGER  PRIMARY KEY AUTOINCREMENT,
  id_cliente        INTEGER  NOT NULL,
  forma_pagamento   TEXT     NOT NULL CHECK (forma_pagamento IN ('DINHEIRO','CARTAO','PIX','FIADO')),
  status            TEXT     NOT NULL DEFAULT 'PAGO' CHECK (status IN ('PENDENTE','PAGO','CANCELADO')),
  total_pedido      REAL     NOT NULL DEFAULT 0 CHECK (total_pedido >= 0),
  criado_em         DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- Trigger para atualizar 'atualizado_em' em qualquer UPDATE
CREATE TRIGGER IF NOT EXISTS pedido_atualizado_em
AFTER UPDATE ON pedido
FOR EACH ROW
BEGIN
  UPDATE pedido SET atualizado_em = CURRENT_TIMESTAMP WHERE id_pedido = OLD.id_pedido;
END;

CREATE INDEX IF NOT EXISTS idx_pedido_cliente   ON pedido(id_cliente);
CREATE INDEX IF NOT EXISTS idx_pedido_status    ON pedido(status);

-- =====================================================
-- Tabela: item_pedido
-- Itens dentro de cada pedido (relaciona pedido <-> produto).
-- Resolve o N:N entre pedido e produto.
-- preco_unitario e CONGELADO no momento da venda — se o preco do
-- produto mudar amanha, o pedido de hoje preserva o valor cobrado.
-- =====================================================
CREATE TABLE IF NOT EXISTS item_pedido (
  id_item          INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pedido        INTEGER NOT NULL,
  id_produto       INTEGER NOT NULL,
  quantidade       INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario   REAL    NOT NULL CHECK (preco_unitario > 0),
  FOREIGN KEY (id_pedido)  REFERENCES pedido(id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE INDEX IF NOT EXISTS idx_item_pedido_pedido    ON item_pedido(id_pedido);
CREATE INDEX IF NOT EXISTS idx_item_pedido_produto   ON item_pedido(id_produto);