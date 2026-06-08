# Relatório de Manutenção de Software — API REST: Loja de Bebidas

**API REST – Sistema de Pedidos para Loja de Bebidas**  
**FATEC Indaiatuba · Análise e Desenvolvimento de Sistemas · Grupo G · 2026**  
**Repositório:** https://github.com/viniciusroll/apirest-pi

---

## Sumário

1. [Introdução](#1-introdução)
2. [Objetivo](#2-objetivo)
3. [Manutenção Corretiva](#3-manutenção-corretiva)
   - 3.1 [C-01 – Registro de pedido com estoque insuficiente](#31-ocorrência-c-01--registro-de-pedido-com-estoque-insuficiente)
   - 3.2 [C-02 – Cadastro duplicado de clientes](#32-ocorrência-c-02--cadastro-duplicado-de-clientes)
   - 3.3 [C-03 – Exclusão de produto com pedidos vinculados](#33-ocorrência-c-03--exclusão-de-produto-com-pedidos-vinculados)
4. [Manutenção Adaptativa](#4-manutenção-adaptativa)
   - 4.1 [A-01 – Inclusão do Pix como forma de pagamento](#41-adaptação-a-01--inclusão-do-pix-como-forma-de-pagamento)
   - 4.2 [A-02 – Preparação para migração de banco de dados](#42-adaptação-a-02--preparação-para-migração-de-banco-de-dados)
5. [Manutenção Evolutiva](#5-manutenção-evolutiva)
   - 5.1 [E-01 – Relatórios gerenciais avançados](#51-evolução-e-01--relatórios-gerenciais-avançados)
   - 5.2 [E-02 – Interface de usuário web](#52-evolução-e-02--interface-de-usuário-web)
   - 5.3 [E-03 – Integração com WhatsApp](#53-evolução-e-03--integração-com-whatsapp)
6. [Manutenção Preventiva](#6-manutenção-preventiva)
   - 6.1 [P-01 – Implementação de testes automatizados](#61-preventiva-p-01--implementação-de-testes-automatizados)
   - 6.2 [P-02 – Sistema de logs e monitoramento](#62-preventiva-p-02--sistema-de-logs-e-monitoramento)
   - 6.3 [P-03 – Migrations versionadas](#63-preventiva-p-03--migrations-versionadas)
7. [Consolidação das Ocorrências](#7-consolidação-das-ocorrências)
8. [Considerações Finais](#8-considerações-finais)

---

## 1 Introdução

O presente relatório documenta as atividades de manutenção de software realizadas e planejadas para a API REST desenvolvida no âmbito do Projeto Integrador da FATEC Indaiatuba. O sistema tem por finalidade gerenciar as operações de uma loja de bebidas, centralizando o controle de clientes, fornecedores, produtos, pedidos e estoque em uma plataforma digital integrada.

A manutenção de software é definida pela norma **ISO/IEC 14764** como o conjunto de atividades realizadas após a entrega do produto com o objetivo de corrigir falhas, adaptar o sistema a novos ambientes, aperfeiçoar funcionalidades existentes e prevenir a degradação do sistema ao longo do tempo. Em conformidade com essa classificação, este relatório organiza as atividades de manutenção em quatro categorias: **corretiva**, **adaptativa**, **evolutiva** e **preventiva**.

O documento tem por objetivo registrar formalmente as ocorrências identificadas, as soluções aplicadas e os planos de melhoria para versões futuras do sistema.

---

## 2 Objetivo

Garantir o funcionamento adequado, seguro e eficiente do sistema, por meio do registro sistemático das atividades de manutenção realizadas e planejadas, identificando falhas corrigidas, adaptações necessárias, melhorias implementadas e medidas preventivas adotadas para preservar a integridade e a qualidade do software.

---

## 3 Manutenção Corretiva

A manutenção corretiva compreende as atividades realizadas para identificar e eliminar defeitos que causam falhas no comportamento esperado do sistema, conforme evidenciado durante os testes manuais realizados com as ferramentas Insomnia e Apidog.

### 3.1 Ocorrência C-01 – Registro de pedido com estoque insuficiente

| Campo | Detalhe |
|---|---|
| **Identificador** | C-01 |
| **Prioridade** | Alta |
| **Duração da correção** | Aproximadamente 3 horas |
| **Componente direto afetado** | Service de Pedido (`pedido.service.ts`) |
| **Componentes indiretos afetados** | Repository de Produto (`produto.repository.ts`) · Tabela `produto` (campo `estoque`) · Tabela `movimento_estoque` |

**Descrição do problema**  
Durante os testes foi identificado que era possível registrar um pedido mesmo quando a quantidade solicitada de um produto era superior ao saldo disponível em estoque, gerando inconsistência entre os dados registrados e o estoque real.

**Causa raiz**  
Ausência de validação prévia do saldo em estoque na camada de service antes da inserção do item de pedido no banco de dados.

**Solução aplicada**  
Implementação de verificação de saldo disponível no service de pedido, consultando o campo `estoque` da tabela `produto` antes de processar cada item. Caso a quantidade solicitada exceda o saldo, a operação é rejeitada com retorno HTTP 409 Conflict e mensagem descritiva ao cliente.

**Resultado obtido**  
Eliminação de inconsistências no controle de estoque. A regra de negócio RN01 passou a ser aplicada corretamente em todos os cenários de teste.

---

### 3.2 Ocorrência C-02 – Cadastro duplicado de clientes

| Campo | Detalhe |
|---|---|
| **Identificador** | C-02 |
| **Prioridade** | Alta |
| **Duração da correção** | Aproximadamente 1 hora |
| **Componente direto afetado** | Controller de Cliente (`cliente.controller.ts`) · Middleware de tratamento de erros (`error.middleware.ts`) |
| **Componentes indiretos afetados** | Tabela `cliente` (constraint `UNIQUE` no campo `cpf`) · Schema Zod de cliente |

**Descrição do problema**  
Ao tentar cadastrar um cliente com CPF já existente no banco de dados, o sistema retornava um erro genérico de banco de dados sem tratamento adequado, expondo detalhes internos da exceção ao cliente da API.

**Causa raiz**  
O middleware centralizado de erros não tratava especificamente a exceção de violação de constraint `UNIQUE` do SQLite, repassando o erro bruto ao cliente.

**Solução aplicada**  
Adição de tratamento específico para erros de violação de unicidade no middleware de erros, convertendo a exceção do SQLite em resposta HTTP 409 Conflict com mensagem padronizada e amigável ao integrador.

**Resultado obtido**  
Maior integridade dos dados cadastrados e respostas de erro padronizadas, consistentes com as demais mensagens da API.

---

### 3.3 Ocorrência C-03 – Exclusão de produto com pedidos vinculados

| Campo | Detalhe |
|---|---|
| **Identificador** | C-03 |
| **Prioridade** | Média |
| **Duração da correção** | Aproximadamente 2 horas |
| **Componente direto afetado** | Service de Produto (`produto.service.ts`) |
| **Componentes indiretos afetados** | Tabela `item_pedido` (FK `id_produto`) · Repository de Produto |

**Descrição do problema**  
O endpoint `DELETE /produtos/:id` permitia excluir um produto que já havia sido utilizado em pedidos, violando a integridade referencial e comprometendo o histórico de vendas.

**Causa raiz**  
Ausência de verificação de dependências na camada de service antes de executar a exclusão no repositório.

**Solução aplicada**  
Implementação de consulta prévia na tabela `item_pedido` para verificar a existência de registros vinculados ao produto. Caso existam, a exclusão é bloqueada com retorno HTTP 409 Conflict, preservando o histórico de pedidos.

**Resultado obtido**  
Integridade referencial garantida na camada de aplicação, independente das configurações do banco de dados.

---

## 4 Manutenção Adaptativa

A manutenção adaptativa compreende as modificações realizadas para adequar o sistema a mudanças no ambiente operacional, em requisitos externos ou em novas necessidades do estabelecimento, sem alterar as funcionalidades essenciais já implementadas.

### 4.1 Adaptação A-01 – Inclusão do Pix como forma de pagamento

| Campo | Detalhe |
|---|---|
| **Identificador** | A-01 |
| **Prioridade** | Alta |
| **Duração da adaptação** | Aproximadamente 2 horas |
| **Componente direto afetado** | Schema Zod de Pedido (`pedido.schema.ts`) · Tabela `pedido` (`CHECK` constraint campo `forma_pagamento`) |
| **Componentes indiretos afetados** | Service de Pedido · Controller de Pedido · Relatório de vendas por forma de pagamento |

**Necessidade identificada**  
A loja passou a utilizar Pix como modalidade de pagamento aceita, exigindo a inclusão dessa opção nas regras de negócio do sistema.

**Adaptação realizada**  
Atualização da `CHECK` constraint da tabela `pedido` para incluir o valor `'PIX'` no domínio do campo `forma_pagamento`. Atualização do schema Zod correspondente para validar e aceitar a nova modalidade nas requisições de criação e atualização de pedidos.

**Resultado obtido**  
Maior flexibilidade no processo de vendas, com suporte à modalidade de pagamento mais utilizada no comércio brasileiro.

---

### 4.2 Adaptação A-02 – Preparação para migração de banco de dados

| Campo | Detalhe |
|---|---|
| **Identificador** | A-02 |
| **Prioridade** | Baixa (planejada) |
| **Duração estimada** | 8 a 12 horas (estimativa para versão futura) |
| **Componente direto afetado** | Camada de Repositories (todos os módulos) · Configuração de conexão (`config/database.ts`) |
| **Componentes indiretos afetados** | Schema SQL (`schema.sql`) · Variáveis de ambiente (`.env`) · Scripts de seed e inicialização |

**Necessidade identificada**  
O SQLite, adotado pela simplicidade e adequação ao escopo acadêmico, apresenta limitações de concorrência e escalabilidade que podem comprometer o sistema em ambiente de produção com múltiplos usuários simultâneos.

**Adaptação planejada**  
Substituição do SQLite pelo PostgreSQL na camada de repositórios, sem alteração das regras de negócio implementadas nos services. A arquitetura em camadas adotada no projeto isola o acesso ao banco de dados nos repositories, viabilizando a troca com impacto mínimo nas demais camadas.

**Resultado esperado**  
Melhor desempenho, suporte a múltiplas conexões simultâneas, recursos avançados de consulta e maior robustez em ambiente de produção.

---

## 5 Manutenção Evolutiva

A manutenção evolutiva, também denominada manutenção de aperfeiçoamento, compreende as atividades voltadas à incorporação de novas funcionalidades e à melhoria das já existentes, ampliando o valor entregue pelo sistema aos seus usuários.

### 5.1 Evolução E-01 – Relatórios gerenciais avançados

| Campo | Detalhe |
|---|---|
| **Identificador** | E-01 |
| **Prioridade** | Alta |
| **Duração estimada** | 10 a 15 horas |
| **Componente direto afetado** | Service de Relatório (`relatorio.service.ts`) · Routes de Relatório (`relatorio.route.ts`) |
| **Componentes indiretos afetados** | Tabelas `pedido`, `item_pedido`, `produto`, `cliente` · Repository de Relatório |

**Situação atual**  
O sistema registra pedidos e movimentações de estoque, mas os relatórios disponíveis são limitados à listagem básica de registros sem agregações ou filtros avançados.

**Evolução proposta**  
Desenvolvimento de endpoints de relatório com agregação de dados, contemplando:
- Produtos mais vendidos por período
- Faturamento diário, semanal e mensal
- Clientes com maior volume de compras
- Produtos com estoque abaixo de nível mínimo configurável
- Clientes inadimplentes com valor total em aberto

**Benefício esperado**  
Suporte à tomada de decisões gerenciais com base em dados consolidados, reduzindo a dependência de análises manuais.

---

### 5.2 Evolução E-02 – Interface de usuário web

| Campo | Detalhe |
|---|---|
| **Identificador** | E-02 |
| **Prioridade** | Alta |
| **Duração estimada** | 40 a 60 horas |
| **Componente direto afetado** | Nova camada de apresentação (front-end, externo à API atual) |
| **Componentes indiretos afetados** | Todos os endpoints da API · CORS middleware · Documentação OpenAPI/Swagger |

**Situação atual**  
O sistema é exclusivamente back-end. O acesso às funcionalidades requer o uso de ferramentas técnicas como Insomnia ou Apidog, inviabilizando o uso direto pelos colaboradores da loja sem treinamento específico.

**Evolução proposta**  
Desenvolvimento de interface web responsiva consumindo a API REST, com:
- Telas de cadastro de clientes, produtos e fornecedores
- Registro e acompanhamento de pedidos
- Visualização de relatórios gerenciais
- Painel de controle de estoque com alertas visuais

**Benefício esperado**  
Democratização do acesso ao sistema, eliminando a necessidade de ferramentas técnicas e tornando o sistema utilizável pelos colaboradores com treinamento básico.

---

### 5.3 Evolução E-03 – Integração com WhatsApp

| Campo | Detalhe |
|---|---|
| **Identificador** | E-03 |
| **Prioridade** | Média |
| **Duração estimada** | 20 a 30 horas |
| **Componente direto afetado** | Novo módulo de integração (`whatsapp.service.ts`) · Service de Pedido |
| **Componentes indiretos afetados** | Controller de Pedido · Tabela `pedido` · Tabela `cliente` |

**Situação atual**  
Os pedidos recebidos via WhatsApp são registrados manualmente pelos colaboradores no sistema, etapa que pode gerar atrasos e erros de transcrição.

**Evolução proposta**  
Integração com a API oficial do WhatsApp Business para recebimento e processamento automatizado de pedidos, com:
- Identificação do cliente pelo número de telefone cadastrado
- Confirmação automática do pedido via mensagem
- Notificação em caso de produto sem estoque

**Benefício esperado**  
Redução do tempo de atendimento, eliminação de erros de transcrição e maior agilidade no processo de vendas.

---

## 6 Manutenção Preventiva

A manutenção preventiva compreende as atividades realizadas com o objetivo de reduzir a probabilidade de falhas futuras, aumentar a confiabilidade do sistema e facilitar sua evolução ao longo do tempo, sem necessariamente corrigir defeitos já manifestados.

### 6.1 Preventiva P-01 – Implementação de testes automatizados

| Campo | Detalhe |
|---|---|
| **Identificador** | P-01 |
| **Prioridade** | Alta |
| **Duração estimada** | 15 a 20 horas |
| **Componente direto afetado** | Todos os services e repositories · Nova pasta `/tests` no projeto |
| **Componentes indiretos afetados** | Pipeline de CI/CD (GitHub Actions) · Scripts npm |

**Justificativa**  
Os testes realizados no projeto são integralmente manuais, o que não garante a regressão automática de funcionalidades após alterações no código. A ausência de testes automatizados aumenta o risco de introdução de novos defeitos durante manutenções futuras.

**Ação preventiva proposta**  
Implementação de testes unitários com **Vitest** para os services e testes de integração com **Supertest** para os endpoints da API, com execução automática a cada Pull Request via GitHub Actions.

**Resultado esperado**  
Detecção precoce de regressões, maior confiança nas entregas e redução do tempo gasto em testes manuais repetitivos.

---

### 6.2 Preventiva P-02 – Sistema de logs e monitoramento

| Campo | Detalhe |
|---|---|
| **Identificador** | P-02 |
| **Prioridade** | Média |
| **Duração estimada** | 6 a 10 horas |
| **Componente direto afetado** | Middleware centralizado de erros (`error.middleware.ts`) · Configuração do servidor (`server.ts`) |
| **Componentes indiretos afetados** | Todos os controllers e services · Infraestrutura de hospedagem |

**Justificativa**  
O sistema não possui registro estruturado de logs de operação e erros, dificultando o diagnóstico de falhas em ambiente de produção e a análise de padrões de uso.

**Ação preventiva proposta**  
Adoção de biblioteca de logging estruturado (**Winston** ou **Pino**) para registro de requisições, respostas, erros e eventos críticos. Integração com ferramenta de monitoramento para alertas em caso de falhas ou degradação de desempenho.

**Resultado esperado**  
Diagnóstico mais rápido de falhas, melhor rastreabilidade de eventos e base para análise de desempenho e comportamento do sistema.

---

### 6.3 Preventiva P-03 – Migrations versionadas

| Campo | Detalhe |
|---|---|
| **Identificador** | P-03 |
| **Prioridade** | Média |
| **Duração estimada** | 4 a 6 horas |
| **Componente direto afetado** | Pasta `/database` · Scripts npm de inicialização |
| **Componentes indiretos afetados** | Pipeline de deploy · Documentação técnica |

**Justificativa**  
O esquema do banco de dados é definido em um único arquivo `schema.sql` executado na inicialização, sem controle de versão das alterações estruturais. Qualquer mudança no esquema exige execução manual de scripts, aumentando o risco de inconsistências entre ambientes de desenvolvimento e produção.

**Ação preventiva proposta**  
Adoção de sistema de migrations versionadas (**Knex.js** ou **Drizzle ORM**) para controle incremental das alterações no esquema do banco de dados, com rastreamento automático da versão aplicada em cada ambiente.

**Resultado esperado**  
Evolução controlada e rastreável do esquema do banco de dados, redução de erros em deploys e facilitação do trabalho colaborativo entre os integrantes da equipe.

---

## 7 Consolidação das Ocorrências

| ID | Categoria | Descrição | Prioridade | Duração | Status |
|---|---|---|---|---|---|
| C-01 | Corretiva | Estoque insuficiente | Alta | ~3 h | ✅ Concluída |
| C-02 | Corretiva | Cadastro duplicado | Alta | ~1 h | ✅ Concluída |
| C-03 | Corretiva | Exclusão indevida | Média | ~2 h | ✅ Concluída |
| A-01 | Adaptativa | Inclusão do Pix | Alta | ~2 h | ✅ Concluída |
| A-02 | Adaptativa | Migração de BD | Baixa | 8–12 h | 🗓️ Planejada |
| E-01 | Evolutiva | Relatórios avançados | Alta | 10–15 h | 🗓️ Planejada |
| E-02 | Evolutiva | Interface web | Alta | 40–60 h | 🗓️ Planejada |
| E-03 | Evolutiva | Integração WhatsApp | Média | 20–30 h | 🗓️ Planejada |
| P-01 | Preventiva | Testes automatizados | Alta | 15–20 h | 🗓️ Planejada |
| P-02 | Preventiva | Logs e monitoramento | Média | 6–10 h | 🗓️ Planejada |
| P-03 | Preventiva | Migrations versionadas | Média | 4–6 h | 🗓️ Planejada |

---

## 8 Considerações Finais

O presente relatório documentou **onze ocorrências de manutenção** distribuídas entre as categorias corretiva, adaptativa, evolutiva e preventiva, cobrindo desde defeitos identificados e corrigidos durante os testes até melhorias planejadas para versões futuras do sistema.

As três ocorrências corretivas registradas foram integralmente resolvidas, garantindo a conformidade do sistema com as regras de negócio especificadas — em particular a vedação de vendas sem estoque, a integridade dos dados cadastrais e a preservação do histórico de pedidos. A ocorrência adaptativa de inclusão do Pix foi concluída com sucesso, refletindo a capacidade do sistema de incorporar mudanças do ambiente operacional sem comprometer as funcionalidades existentes.

As ocorrências planejadas — evolutivas e preventivas — constituem o **roadmap de desenvolvimento** para as próximas versões, com destaque para a interface web (E-02), os relatórios gerenciais avançados (E-01) e a implementação de testes automatizados (P-01) como prioridades de maior impacto para a maturidade e a usabilidade do sistema.

A estrutura em camadas adotada na arquitetura da API — com separação entre `routes`, `controllers`, `services` e `repositories` — mostrou-se adequada para viabilizar as manutenções realizadas com baixo impacto entre os módulos, confirmando a relevância das boas práticas de engenharia de software adotadas desde a fase de projeto.

---
