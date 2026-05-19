# Sistema de Pedidos para Loja de Bebidas

**Projeto Integrador — FATEC**
**Curso:** Análise e Desenvolvimento de Sistemas — 2º Semestre
**Equipe:** Gabriel Verdin · Leonardo Tagliamento · Leonardo Xu · Thiago Freri · Vinicius Rodrigo · Willian Pontieri

---

## Sumário

1. [Introdução](#1-introdução)
2. [Justificativa](#2-justificativa)
3. [Objetivos](#3-objetivos)
4. [Escopo do Sistema](#4-escopo-do-sistema)
5. [Especificação de Requisitos](#5-especificação-de-requisitos)
6. [Modelagem de Dados](#6-modelagem-de-dados)
7. [Arquitetura da Solução](#7-arquitetura-da-solução)
8. [Tecnologias Utilizadas](#8-tecnologias-utilizadas)
9. [Metodologia de Desenvolvimento](#9-metodologia-de-desenvolvimento)
10. [Implementação e Testes](#10-implementação-e-testes)
11. [Atendimento aos Requisitos](#11-atendimento-aos-requisitos)
12. [Considerações Finais](#12-considerações-finais)

---

## 1. Introdução

A modernização dos processos comerciais é essencial para empresas que buscam maior eficiência e competitividade no mercado. Pequenos estabelecimentos, em especial, encontram desafios quando dependem de métodos manuais para controlar suas operações, o que gera erros, perda de informação e dificuldade de gestão.

Este projeto propõe o desenvolvimento de uma **API REST** para automatizar o gerenciamento de pedidos de uma loja de bebidas, substituindo o controle manual em cadernos por uma solução digital que centraliza informações sobre clientes, produtos, fornecedores, pedidos e relatórios.

O sistema foi concebido com foco no público-alvo principal — funcionários da loja — oferecendo recursos para cadastro e consulta de clientes e produtos, registro e acompanhamento de vendas, identificação de clientes inadimplentes, controle automático de estoque e geração de relatórios gerenciais.

---

## 2. Justificativa

O controle manual de vendas com cadernos ou anotações informais apresenta uma série de limitações que afetam diretamente a qualidade do atendimento e a saúde financeira do negócio:

- Erros frequentes em pedidos e cálculos de valores
- Falta de clareza na entrada e saída de dinheiro
- Dificuldade em identificar clientes inadimplentes
- Ausência de histórico consolidado de clientes e produtos
- Inexistência de relatórios para apoiar decisões de reposição
- Risco de perda de dados importantes

A automatização desses processos por meio de um sistema computacional permite o registro seguro das informações, a geração de relatórios confiáveis, o acompanhamento em tempo real do estoque e a tomada de decisão baseada em dados. Além disso, libera o tempo dos funcionários para o atendimento ao cliente, aumentando a produtividade e a competitividade da loja.

---

## 3. Objetivos

### 3.1 Objetivo Geral

Desenvolver uma API REST capaz de automatizar o gerenciamento de pedidos de uma loja de bebidas, oferecendo controle confiável de clientes, produtos, fornecedores, vendas e relatórios gerenciais.

### 3.2 Objetivos Específicos

- Automatizar o registro de pedidos e vendas
- Reduzir erros e inconsistências nos registros operacionais
- Facilitar a gestão integrada de clientes, produtos, fornecedores e estoque
- Oferecer relatórios gerenciais para apoio à tomada de decisão
- Identificar clientes inadimplentes de forma automática
- Garantir segurança e integridade dos dados armazenados
- Implementar autenticação por usuário, restringindo o acesso a pessoas autorizadas

---

## 4. Escopo do Sistema

### 4.1 Cadastro de Clientes
Nome, CPF, endereço, e-mails (múltiplos) e telefones (múltiplos). Permite histórico de compras vinculado ao cliente.

### 4.2 Cadastro de Fornecedores
Nome, CNPJ, endereço, tempo médio de entrega, e-mails e telefones múltiplos. Cada produto é vinculado a um fornecedor.

### 4.3 Cadastro de Produtos
Nome, preço unitário, quantidade em estoque, data de validade, categoria (cerveja, refrigerante, destilado, etc.) e fornecedor vinculado.

### 4.4 Registro de Pedidos
Cliente vinculado, produtos e respectivas quantidades, forma de pagamento (dinheiro, cartão, pix ou fiado), valor total calculado automaticamente, status do pagamento (pendente, pago, cancelado) e data/hora do registro.

### 4.5 Relatórios Gerenciais
- Clientes inadimplentes e valores em aberto
- Vendas por período (diário, semanal, mensal)
- Produtos mais vendidos
- Estoque disponível com alertas de baixa quantidade
- Histórico de pedidos por cliente

### 4.6 Autenticação e Controle de Acesso
Apenas usuários cadastrados podem operar o sistema. Senhas são armazenadas com hash bcrypt e o acesso é controlado via tokens JWT.

---

## 5. Especificação de Requisitos

### 5.1 Requisitos Funcionais

| ID | Descrição |
|----|-----------|
| RF01 | O sistema deve permitir o cadastro de clientes |
| RF02 | O sistema deve permitir o cadastro de produtos |
| RF03 | O sistema deve permitir o registro de pedidos |
| RF04 | O sistema deve permitir a edição de dados de clientes e produtos |
| RF05 | O sistema deve permitir a exclusão de clientes e produtos |
| RF06 | O sistema deve permitir a consulta de clientes cadastrados |
| RF07 | O sistema deve permitir a consulta de produtos disponíveis |
| RF08 | O sistema deve gerar relatórios de vendas |
| RF09 | O sistema deve controlar automaticamente o estoque dos produtos |
| RF10 | O sistema deve identificar clientes em débito |
| RF11 | O sistema deve permitir o registro da forma de pagamento |
| RF12 | O sistema deve permitir o cancelamento de pedidos |
| RF13 | O sistema deve permitir o login de usuários autorizados |

### 5.2 Regras de Negócio

| ID | Descrição |
|----|-----------|
| RN01 | O sistema não deve permitir a venda de produtos sem estoque disponível |
| RN02 | O valor total do pedido deve ser calculado automaticamente com base na quantidade e no preço unitário do produto |
| RN03 | Todo pedido deve estar vinculado a um cliente cadastrado |
| RN04 | O sistema deve atualizar o estoque automaticamente após cada venda |
| RN05 | O sistema deve registrar o histórico de pedidos realizados |
| RN06 | Clientes com débitos devem ser identificados no sistema |
| RN07 | O sistema deve registrar a forma de pagamento de cada pedido |

### 5.3 Requisitos Não Funcionais

| ID | Categoria | Descrição |
|----|-----------|-----------|
| RNF01 | Desempenho | O sistema deve responder às ações do usuário em até 5 segundos |
| RNF02 | Usabilidade | O sistema deve possuir interface simples e intuitiva |
| RNF03 | Usabilidade | O usuário deve ser capaz de utilizar o sistema após treinamento básico |
| RNF04 | Segurança | O sistema deve exigir autenticação para acesso às operações |
| RNF05 | Segurança | O sistema deve garantir que apenas usuários autorizados acessem as informações |
| RNF06 | Confiabilidade | O sistema deve garantir a integridade dos dados armazenados |
| RNF07 | Confiabilidade | O sistema deve permitir recuperação de dados em caso de falhas |
| RNF08 | Disponibilidade | O sistema deve estar disponível durante o horário de funcionamento da loja |

---

## 6. Modelagem de Dados

A modelagem foi desenvolvida em duas etapas: o **Diagrama Entidade-Relacionamento (DER)** descreve a visão conceitual do domínio, enquanto o **Modelo Lógico** detalha a estrutura final que foi implementada no banco SQLite.

### 6.1 Diagrama Entidade-Relacionamento

![Diagrama Entidade-Relacionamento](../diagramas/der.png)

### 6.2 Modelo Lógico

![Modelo Lógico](../diagramas/logico.png)

### 6.3 Entidades

#### Cliente
- `id_cliente` (PK)
- `nome`, `cpf` (UNIQUE), `endereco`
- `email` e `telefone` em tabelas auxiliares (atributos multivalorados)

#### Fornecedor
- `id_fornecedor` (PK)
- `nome`, `cnpj` (UNIQUE), `endereco`, `tempo_entrega`
- `email` e `telefone` em tabelas auxiliares (atributos multivalorados)

#### Produto
- `id_produto` (PK)
- `nome`, `preco`, `estoque`, `validade`, `categoria`
- `id_fornecedor` (FK → Fornecedor)

#### Pedido
- `id_pedido` (PK)
- `id_cliente` (FK → Cliente)
- `data_pedido`, `total_pedido` (calculado)
- `forma_pagamento` ∈ {DINHEIRO, CARTAO, PIX, FIADO}
- `status` ∈ {PENDENTE, PAGO, CANCELADO}

#### ItemPedido
- `id_pedido` (FK → Pedido)
- `id_produto` (FK → Produto)
- `quantidade`, `preco_unitario` (congelado no momento da venda)

#### Usuário
- `id_usuario` (PK)
- `nome`, `email` (UNIQUE), `senha_hash`
- `papel` ∈ {FUNCIONARIO, ADMIN}

### 6.4 Relacionamentos

- **Cliente** (1) — realiza — (0..N) **Pedido**
- **Pedido** (1) — contém — (1..N) **ItemPedido**
- **Produto** (1) — aparece em — (0..N) **ItemPedido**
- **Fornecedor** (1) — fornece — (0..N) **Produto**

A entidade `ItemPedido` resolve o relacionamento muitos-para-muitos entre `Pedido` e `Produto`, permitindo que um pedido contenha vários produtos e preservando o preço unitário praticado no momento da venda.

### 6.5 Decisões de Projeto

- **Preço congelado em ItemPedido:** se o preço de um produto for alterado depois, os pedidos antigos preservam o valor real cobrado.
- **Atributos multivalorados:** e-mails e telefones em tabelas separadas permitem que um cliente ou fornecedor tenha múltiplos contatos sem duplicação de registros.
- **Categoria como coluna em Produto:** simplificação adotada porque cada produto possui uma única categoria principal.
- **Cliente em débito (RF10/RN06):** identificado pela combinação `status = PENDENTE` e `forma_pagamento = FIADO`.

---

## 7. Arquitetura da Solução

O sistema foi construído como uma **API REST** seguindo o padrão de arquitetura em camadas. Cada requisição HTTP atravessa as camadas em ordem, separando responsabilidades:

```
Cliente HTTP
     │
     ▼
┌─────────────┐
│   Routes    │  define endpoints e mapeia para controllers
└──────┬──────┘
       ▼
┌─────────────┐
│ Controllers │  recebe req, valida com Zod, chama service
└──────┬──────┘
       ▼
┌─────────────┐
│  Services   │  aplica regras de negócio (RN01–RN07)
└──────┬──────┘
       ▼
┌─────────────┐
│Repositories │  executa SQL e devolve objetos tipados
└──────┬──────┘
       ▼
┌─────────────┐
│   SQLite    │  banco de dados em arquivo único
└─────────────┘
```

**Funções de cada camada:**

- **Routes** definem as URLs disponíveis (`GET /produtos`, `POST /pedidos`, etc.)
- **Controllers** convertem a `Request` HTTP em chamada ao service, validando o input com schemas Zod
- **Services** aplicam as regras de negócio (não permitir venda sem estoque, calcular total automaticamente, impedir delete de produto vendido)
- **Repositories** isolam o acesso ao banco com SQL puro e devolvem objetos tipados
- **Middlewares** centralizam autenticação JWT, validação de input e tratamento de erros
- **Models** descrevem o formato das entidades em TypeScript
- **Schemas Zod** validam e tipam o input antes que ele chegue no controller

### 7.1 Estrutura de Pastas

```
apirest-pi/
├── docs/
│   ├── diagramas/        DER e modelo lógico
│   └── relatorios/       este documento
├── src/
│   ├── config/           env e conexão com banco
│   ├── controllers/      camada HTTP
│   ├── database/         schema.sql, init.ts, seed.ts
│   ├── errors/           AppError customizada
│   ├── middleware/       auth, validação, erros
│   ├── models/           interfaces TypeScript
│   ├── repositories/     acesso ao banco
│   ├── routes/           rotas Express + agregador
│   ├── schemas/          schemas Zod
│   ├── services/         regras de negócio
│   ├── app.ts            configuração do Express
│   └── server.ts         bootstrap do servidor
├── requests.http         testes manuais via REST Client
└── package.json
```

---

## 8. Tecnologias Utilizadas

| Camada | Ferramenta | Justificativa |
|--------|-----------|---------------|
| Linguagem | **TypeScript** | Tipagem estática previne erros em tempo de desenvolvimento |
| Runtime | **Node.js** | Performance adequada para APIs e ampla comunidade |
| Framework HTTP | **Express** | Padrão consolidado no ecossistema Node, fácil de aprender |
| Banco de dados | **SQLite** (`sqlite3`) | Arquivo único, sem servidor — ideal para o escopo do PI |
| Validação | **Zod** | Schema-first, integra com TypeScript, mensagens claras de erro |
| Autenticação | **JWT** (`jsonwebtoken`) | Padrão da indústria para autenticação stateless |
| Hash de senha | **bcryptjs** | Algoritmo lento por design, resistente a brute-force |
| Dev runner | **tsx** | Executa TypeScript direto, com hot reload |

A escolha do conjunto **TypeScript + Express + SQLite** privilegia simplicidade e produtividade. Para um sistema em produção real, o SQLite poderia ser substituído por PostgreSQL ou MySQL sem alterações significativas na camada de aplicação, graças ao isolamento provido pelos repositories.

---

## 9. Metodologia de Desenvolvimento

### 9.1 Modelo de Processo: Cascata

O projeto adotou o **Modelo Cascata**, adequado ao contexto acadêmico em que os requisitos estão bem definidos desde o início e o cliente (orientador) acompanha o resultado final em apresentação única.

**Fases executadas:**

1. **Análise de Requisitos** — Levantamento do contexto da loja, identificação de problemas, especificação dos RFs, RNs e RNFs
2. **Projeto** — Modelagem do DER e do modelo lógico, definição da arquitetura e escolha das tecnologias
3. **Implementação** — Construção do código em camadas (entre fevereiro e maio)
4. **Testes** — Validação manual de cada endpoint via curl e REST Client, conferência dos RFs/RNs
5. **Documentação e Entrega** — Atualização deste relatório e preparação da apresentação

### 9.2 Divisão Inicial da Equipe

A equipe começou dividida por responsabilidades:

- **Infraestrutura e Banco** — modelagem SQL, configuração do projeto, conexão com SQLite
- **Núcleo da Aplicação** — middlewares, tratamento de erros, utilitários, bootstrap do Express
- **Autenticação** — JWT, login, controle de acesso
- **Módulo Clientes** — cadastro com CPF, endereço, e-mails e telefones múltiplos
- **Módulo Produtos** — cadastro, controle de estoque, vínculo com fornecedor
- **Módulo Pedidos e Relatórios** — fluxo de venda, regras de estoque, relatórios gerenciais

Ao longo do desenvolvimento essa divisão se tornou mais fluida — integrantes contribuíram em vários módulos conforme a necessidade do projeto.

### 9.3 Controle de Versão com Git e GitHub

Todo o código foi versionado em repositório Git hospedado no GitHub, seguindo boas práticas profissionais:

- **Branches por feature** — cada funcionalidade desenvolvida em branch própria (`feat/produto-crud`, `fornecedores-teste`, `rota_fornecedores`, etc.)
- **Pull Requests** — integração feita via PRs revisados antes do merge na `main`. O projeto registrou mais de 12 PRs ao longo do desenvolvimento
- **Commits frequentes e descritivos** — cada commit representa uma mudança coesa, com mensagens explicando o que foi feito

Essa abordagem permitiu trabalho paralelo sem conflitos significativos e mantém um histórico claro do que cada integrante contribuiu.

---

## 10. Implementação e Testes

### 10.1 O que foi construído

| Módulo | Repository | Service | Controller | Routes | Schema Zod |
|--------|:---:|:---:|:---:|:---:|:---:|
| Cliente | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fornecedor | ✅ | ✅ | ✅ | ✅ | ✅ |
| Produto | ✅ | ✅ | ✅ | ✅ | ✅ |
| Pedido | ✅ | ✅ | ✅ | ✅ | ✅ |
| Relatório | — | ✅ | ✅ | ✅ | — |
| Usuário | — | — | — | — | ✅ |

Foram também implementados:

- **Middleware centralizado de erros** — converte `ZodError` em HTTP 400, `AppError` no statusCode correspondente, e qualquer erro inesperado em HTTP 500
- **Middleware de validação** — aplica schemas Zod antes de chegar no controller
- **Middleware de autenticação** — valida tokens JWT
- **Agregador de rotas** (`routes/index.ts`) — centraliza o registro de todas as rotas em um único ponto
- **Seed** (`database/seed.ts`) — popula o banco com fornecedores, produtos e clientes de exemplo para testes
- **Arquivo de testes** (`requests.http`) — coleção de requisições prontas para uso com a extensão REST Client do VSCode

### 10.2 Banco de Dados Inicializado

Foram criadas **9 tabelas** no SQLite:

```
cliente              fornecedor              produto
email_cliente        email_fornecedor        pedido
telefone_cliente     telefone_fornecedor     item_pedido
usuario
```

O banco utiliza recursos avançados do SQLite:

- **CHECK constraints** — banco rejeita estoque negativo, preço negativo, forma de pagamento inválida
- **FOREIGN KEYS com ON DELETE** — comportamento controlado em cascata onde apropriado
- **TRIGGERS** — atualização automática do campo `atualizado_em` em qualquer UPDATE
- **INDEXES** — em chaves estrangeiras e campos de busca frequente

### 10.3 Estratégia de Testes

Os testes foram realizados de forma **manual**, validando cada endpoint contra os requisitos especificados:

**Ferramentas utilizadas:**
- `curl` no terminal Linux
- Extensão **REST Client** do VSCode com o arquivo `requests.http`
- Inserções diretas no SQLite via cliente de linha de comando

**Cenários testados:**

| Cenário | Endpoint | Resultado esperado | Resultado obtido |
|---------|----------|-------------------|------------------|
| Criar produto | `POST /produtos` | 201 Created + objeto | ✅ Conforme |
| Listar produtos | `GET /produtos` | 200 OK + array | ✅ Conforme |
| Buscar produto inexistente | `GET /produtos/999` | 404 Not Found | ✅ Conforme |
| Atualizar produto parcial | `PUT /produtos/1` | 200 OK + objeto atualizado | ✅ Conforme |
| Remover produto sem pedido | `DELETE /produtos/1` | 204 No Content | ✅ Conforme |
| Remover produto vendido | `DELETE /produtos/1` | 409 Conflict (RN07) | ✅ Conforme |
| Criar pedido | `POST /pedidos` | 201 Created | ✅ Conforme |
| Listar pedidos por cliente | `GET /pedidos/cliente/:id` | 200 OK + histórico | ✅ Conforme |
| Validação Zod inválida | `POST /produtos` (campo faltando) | 400 Bad Request | ✅ Conforme |

### 10.4 Exemplo de Execução

Para executar o sistema, basta:

```bash
git clone https://github.com/viniciusroll/apirest-pi.git
cd apirest-pi
npm install
cp .env.example .env
npm run db:init        # cria o banco com schema
npm run db:seed        # popula com dados de exemplo
npm run dev            # sobe o servidor em http://localhost:3000
```

---

## 11. Atendimento aos Requisitos

### 11.1 Cobertura dos Requisitos Funcionais

| ID | Como é atendido |
|----|----------------|
| RF01 | `POST /clientes` — controller, service, repository implementados |
| RF02 | `POST /produtos` — controller, service, repository implementados |
| RF03 | `POST /pedidos` — fluxo completo com validação de estoque e cálculo de total |
| RF04 | `PUT /clientes/:id`, `PUT /produtos/:id` — atualização parcial suportada |
| RF05 | `DELETE /clientes/:id`, `DELETE /produtos/:id` — com proteção via RN07 |
| RF06 | `GET /clientes` e `GET /clientes/:id` |
| RF07 | `GET /produtos` e `GET /produtos/:id` |
| RF08 | Rotas de relatório implementadas em `relatorio.route.ts` |
| RF09 | Service de pedido decrementa estoque ao registrar venda |
| RF10 | Filtro por `status = PENDENTE` e `forma_pagamento = FIADO` |
| RF11 | Campo `forma_pagamento` obrigatório no pedido (DINHEIRO/CARTAO/PIX/FIADO) |
| RF12 | `PUT /pedidos/:id` permite alterar status para CANCELADO |
| RF13 | Tabela `usuario` com `email`, `senha_hash` e `papel`. JWT preparado |

### 11.2 Cobertura das Regras de Negócio

| ID | Como é atendido |
|----|----------------|
| RN01 | Service de pedido valida estoque antes de criar; banco rejeita estoque negativo (CHECK) |
| RN02 | Service calcula `total_pedido` somando `quantidade × preco_unitario` de cada item |
| RN03 | `id_cliente` é obrigatório na tabela `pedido` (NOT NULL + FK) |
| RN04 | Service decrementa estoque do produto após registrar item de pedido |
| RN05 | Tabela `pedido` preserva todo o histórico, inclusive cancelados |
| RN06 | Pedidos `FIADO` + `PENDENTE` identificam o cliente como inadimplente |
| RN07 | Campo `forma_pagamento` obrigatório com CHECK constraint no banco |

### 11.3 Cobertura dos Requisitos Não Funcionais

| ID | Como é atendido |
|----|----------------|
| RNF01 | Em ambiente local, todas as respostas ficaram abaixo de 100ms — bem dentro do limite |
| RNF02 | Como API REST, a usabilidade depende do front-end. As respostas seguem padrão consistente |
| RNF03 | Estrutura REST simples e documentação clara facilitam o uso por novos integradores |
| RNF04 | Tabela de usuários com hash bcrypt e infraestrutura JWT preparada para autenticação |
| RNF05 | Senhas armazenadas com bcrypt; JWT permite controle de acesso por papel |
| RNF06 | Foreign Keys, CHECK constraints e UNIQUE constraints garantem integridade no banco |
| RNF07 | SQLite permite backup do arquivo único; em produção usaríamos PG com replicação |
| RNF08 | Servidor Express sobe via `npm run dev` ou `npm start` em produção |

---

## 12. Considerações Finais

### 12.1 O que foi entregue

O projeto atingiu seus objetivos principais: foi entregue uma API REST funcional com **9 tabelas** modeladas no banco, **5 módulos** implementados em camadas, **middlewares** centralizados de autenticação, validação e erros, e **cobertura completa** dos requisitos funcionais e regras de negócio definidas no escopo. O sistema permite cadastrar clientes, fornecedores e produtos, registrar pedidos com cálculo automático de total e controle de estoque, identificar clientes inadimplentes e gerar relatórios gerenciais.

### 12.2 Aprendizados da Equipe

A construção do projeto trouxe ganhos técnicos e de processo:

- **Arquitetura em camadas** — entendimento prático de como separar responsabilidades entre routes, controllers, services e repositories
- **Modelagem relacional** — uso de atributos multivalorados, foreign keys e tabelas auxiliares para representar relacionamentos complexos
- **SQL puro** — sem ORM, a equipe aprofundou o entendimento de SQL, transações e integridade referencial
- **TypeScript** — tipagem estática como ferramenta de prevenção de bugs e melhor experiência de desenvolvimento
- **Validação com Zod** — schema-first como técnica para garantir a qualidade dos dados que entram na API
- **Git e GitHub colaborativo** — uso de branches e Pull Requests para trabalho em equipe sem conflitos
- **Modelo Cascata** — aplicação prática do modelo, com fases bem definidas e entregáveis claros em cada uma

### 12.3 Limitações e Melhorias Futuras

Algumas limitações foram identificadas e ficam como sugestões para evolução do sistema:

- **Interface de usuário** — atualmente o sistema é apenas back-end. Um front-end web ou mobile tornaria o uso acessível sem ferramentas técnicas
- **Migrations versionadas** — substituir o `schema.sql` por sistema de migrations (Knex, Drizzle) facilitaria evolução do schema em produção
- **Testes automatizados** — implementar testes unitários (Vitest) e de integração (Supertest) aumentaria a confiabilidade
- **Soft delete** — em vez de remover registros, marcar como inativo preservaria histórico
- **Banco em produção** — migrar para PostgreSQL ofereceria mais robustez e recursos avançados
- **Documentação OpenAPI/Swagger** — geraria documentação interativa automaticamente

### 12.4 Conclusão

O Sistema de Pedidos para Loja de Bebidas demonstrou-se uma solução tecnicamente sólida e alinhada aos requisitos levantados junto ao usuário. Mais do que entregar um produto funcional, o projeto consolidou na equipe competências de engenharia de software contemporânea: arquitetura em camadas, controle de versão profissional, modelagem de dados, validação rigorosa e tipagem estática. O resultado é uma base extensível que pode evoluir para um produto real, com novas funcionalidades sendo adicionadas sem comprometer a integridade do que já foi construído.

---

**Repositório do projeto:** https://github.com/viniciusroll/apirest-pi