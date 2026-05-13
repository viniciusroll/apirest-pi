import { db } from "../config/database";

db.serialize(() => {
  // Limpa tabelas na ordem correta (respeita foreign keys)
  db.run("DELETE FROM item_pedido");
  db.run("DELETE FROM pedido");
  db.run("DELETE FROM produto");
  db.run("DELETE FROM email_fornecedor");
  db.run("DELETE FROM telefone_fornecedor");
  db.run("DELETE FROM fornecedor");
  db.run("DELETE FROM email_cliente");
  db.run("DELETE FROM telefone_cliente");
  db.run("DELETE FROM cliente");

  // --- Fornecedores ---
  db.run(
    "INSERT INTO fornecedor (nome, cnpj, endereco, tempo_entrega) VALUES (?, ?, ?, ?)",
    ["Distribuidora Bebidas Sul", "12345678000190", "Rua das Industrias, 500 - Campinas/SP", 3]
  );
  db.run(
    "INSERT INTO fornecedor (nome, cnpj, endereco, tempo_entrega) VALUES (?, ?, ?, ?)",
    ["Atacado Gelado", "98765432000110", "Av. Logistica, 1200 - Jundiai/SP", 5]
  );

  // Emails e telefones do fornecedor 1
  db.run("INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (1, ?)", ["contato@bebidasul.com"]);
  db.run("INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (1, ?)", ["vendas@bebidasul.com"]);
  db.run("INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (1, ?)", ["19999990001"]);
  db.run("INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (1, ?)", ["1932320001"]);

  // Emails e telefones do fornecedor 2
  db.run("INSERT INTO email_fornecedor (id_fornecedor, email) VALUES (2, ?)", ["atacado@gelado.com"]);
  db.run("INSERT INTO telefone_fornecedor (id_fornecedor, telefone) VALUES (2, ?)", ["11988880001"]);

  // --- Produtos ---
  db.run(
    "INSERT INTO produto (nome, preco, estoque, validade, categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)",
    ["Skol Lata 350ml", 3.50, 100, "2026-12-31", "CERVEJA", 1]
  );
  db.run(
    "INSERT INTO produto (nome, preco, estoque, validade, categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)",
    ["Coca-Cola 2L", 10.90, 50, "2026-10-15", "REFRIGERANTE", 1]
  );
  db.run(
    "INSERT INTO produto (nome, preco, estoque, validade, categoria, id_fornecedor) VALUES (?, ?, ?, ?, ?, ?)",
    ["Absolut Vodka 1L", 89.90, 20, "2028-06-01", "DESTILADO", 2]
  );

  // --- Clientes ---
  db.run(
    "INSERT INTO cliente (nome, cpf, endereco) VALUES (?, ?, ?)",
    ["Maria Silva", "12345678901", "Rua das Flores, 123 - Sorocaba/SP"]
  );
  db.run(
    "INSERT INTO cliente (nome, cpf, endereco) VALUES (?, ?, ?)",
    ["Joao Pereira", "98765432100", "Av. Brasil, 456 - Sorocaba/SP"]
  );

  // Emails e telefones do cliente 1
  db.run("INSERT INTO email_cliente (id_cliente, email) VALUES (1, ?)", ["maria@email.com"]);
  db.run("INSERT INTO email_cliente (id_cliente, email) VALUES (1, ?)", ["maria.silva@trabalho.com"]);
  db.run("INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (1, ?)", ["15999990001"]);

  // Emails e telefones do cliente 2
  db.run("INSERT INTO email_cliente (id_cliente, email) VALUES (2, ?)", ["joao@email.com"]);
  db.run("INSERT INTO email_cliente (id_cliente, email) VALUES (2, ?)", ["joao.pessoal@email.com"]);
  db.run("INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (2, ?)", ["15999990002"]);
  db.run("INSERT INTO telefone_cliente (id_cliente, telefone) VALUES (2, ?)", ["1533330002"]);

  console.log("Seed executado com sucesso.");
  console.log("  - 2 fornecedores");
  console.log("  - 3 produtos");
  console.log("  - 2 clientes");
});
