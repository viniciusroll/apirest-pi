# Levantamento de Requisitos e Análise de Riscos

**API REST – Sistema de Pedidos para Loja de Bebidas**  
**FATEC Indaiatuba · Análise e Desenvolvimento de Sistemas · Grupo G · 2026**  
**Repositório:** https://github.com/viniciusroll/apirest-pi

---

## Sumário

1. [Introdução](#1-introdução)
2. [Contexto e Problema](#2-contexto-e-problema)
3. [Levantamento de Requisitos](#3-levantamento-de-requisitos)
4. [Análise de Riscos](#4-análise-de-riscos)
5. [Considerações Finais](#5-considerações-finais)

---

## 1 Introdução

O presente documento registra formalmente as atividades realizadas na primeira fase do ciclo de vida do software desenvolvido pelo Grupo G no âmbito do Projeto Integrador da FATEC Indaiatuba: o **Levantamento de Requisitos**, acompanhado da respectiva **Análise de Riscos**. No Modelo Cascata adotado pela equipe, esta fase inaugura o ciclo de desenvolvimento e tem como produto principal a especificação completa das necessidades do sistema, que servirá de base para todas as fases subsequentes — Projeto, Implementação, Testes e Entrega.

O sistema em questão é uma API REST destinada ao gerenciamento operacional de uma loja de bebidas, cobrindo o controle de clientes, fornecedores, produtos, pedidos e estoque. A loja operava anteriormente com registros manuais e anotações informais, contexto que motivou a concepção da solução digital descrita neste documento.

Este documento está estruturado em duas partes principais: a primeira trata do levantamento e da especificação de requisitos funcionais, regras de negócio e requisitos não funcionais, obtidos por meio da técnica de entrevista; a segunda apresenta a análise dos principais riscos identificados para o projeto, com avaliação de probabilidade, impacto e estratégias de mitigação.

---

## 2 Contexto e Problema

### 2.1 Caracterização do Ambiente

A loja de bebidas que serve de contexto para este projeto realizava, até o início do desenvolvimento, a totalidade de suas operações por meio de anotações manuais em cadernos e registros informais. Os pedidos dos clientes eram recebidos por meio do aplicativo WhatsApp e transcritos manualmente pelos colaboradores, sem qualquer sistema de apoio à gestão.

O público-alvo interno do sistema são os próprios funcionários do estabelecimento — vendedores, estoquistas e gerentes — que necessitam de uma ferramenta para registrar e consultar informações operacionais de forma ágil e confiável. Clientes e fornecedores são tratados como atores externos ao sistema e não interagem diretamente com a plataforma.

### 2.2 Problemas Identificados

A partir da análise do ambiente operacional, foram identificados os seguintes problemas que motivaram o desenvolvimento do sistema:

- Ausência de controle sistematizado de estoque, impossibilitando o acompanhamento preciso de entradas, saídas e saldos disponíveis de produtos.
- Inexistência de cadastro estruturado de clientes e fornecedores, dificultando a rastreabilidade do histórico de compras e negociações.
- Dificuldade em acompanhar o status dos pagamentos recebidos, especialmente em vendas realizadas na modalidade _fiado_, gerando risco de inadimplência não identificada.
- Erros frequentes na transcrição de pedidos e no cálculo manual de totais, comprometendo a confiabilidade das informações financeiras.
- Ausência de relatórios consolidados que subsidiassem a tomada de decisão gerencial sobre reposição de estoque, desempenho de vendas e perfil dos clientes.
- Risco de perda definitiva de informações em caso de extravio ou deterioração dos registros físicos.

### 2.3 Solução Proposta

A solução proposta consiste no desenvolvimento de uma API REST construída com TypeScript, Node.js, Express e SQLite, organizada em arquitetura de camadas (`Routes → Controllers → Services → Repositories`) e com autenticação de usuários via tokens JWT. O sistema centraliza em uma única plataforma digital o gerenciamento de clientes, fornecedores, produtos, pedidos, movimentações de estoque e relatórios gerenciais.

---

## 3 Levantamento de Requisitos

O levantamento de requisitos constitui a base de todo o processo de desenvolvimento de software. Sua finalidade é compreender profundamente as necessidades dos usuários e do negócio antes que qualquer decisão técnica seja tomada, garantindo que o sistema a ser construído resolva os problemas reais do cliente. No Modelo Cascata, esta fase é especialmente crítica: por ser sequencial e pouco tolerante a mudanças tardias, erros ou omissões no levantamento de requisitos tendem a se propagar e se agravar nas fases seguintes, tornando-os progressivamente mais custosos de corrigir (PRESSMAN; MAXIM, 2021).

### 3.1 Técnica Utilizada: Entrevista

A técnica selecionada para o levantamento de requisitos foi a **entrevista**, reconhecida na literatura de Engenharia de Software como uma das abordagens mais eficazes para a coleta de informações em domínios de negócio pouco formalizados, como o de pequenos estabelecimentos comerciais. Segundo Sommerville (2018), a entrevista permite que o analista explore o contexto operacional com profundidade, identificando não apenas as necessidades explícitas dos usuários, mas também requisitos implícitos que dificilmente emergiriam por meio de questionários ou observação passiva.

A escolha pela entrevista justifica-se também pelo perfil do público-alvo: funcionários de uma loja de bebidas sem experiência prévia com sistemas informatizados, que tendem a expressar suas necessidades em termos operacionais concretos — _"precisamos saber quem está devendo"_, _"queremos ver quanto tem no estoque"_, _"queremos registrar os pedidos do WhatsApp"_ — e não em termos técnicos ou funcionais formais. A entrevista possibilita que o analista traduza essa linguagem do domínio para a linguagem de requisitos de software.

### 3.2 Planejamento das Entrevistas

Antes da realização das entrevistas, a equipe elaborou um roteiro semiestruturado com perguntas abertas e fechadas, organizado em três blocos temáticos: (a) compreensão do fluxo operacional atual; (b) identificação de problemas e dificuldades; e (c) expectativas e desejos em relação ao sistema. O roteiro semiestruturado foi escolhido por oferecer flexibilidade para aprofundar tópicos que emergissem naturalmente durante a conversa, sem perder o foco nos objetivos da coleta.

**Exemplos de perguntas utilizadas no roteiro:**

- Como vocês registram hoje os pedidos recebidos pelo WhatsApp?
- De que forma é feito o controle de estoque atualmente? Com que frequência ele é atualizado?
- Como identificam clientes que estão devendo? Existe algum controle de fiado?
- Quais informações sobre clientes e fornecedores precisam estar disponíveis no sistema?
- Com que frequência é necessário consultar o histórico de pedidos de um cliente?
- Quem precisa ter acesso ao sistema? Todos teriam o mesmo nível de permissão?
- Quais relatórios ou informações resumidas seriam mais úteis para a gestão da loja?

### 3.3 Condução das Entrevistas

As entrevistas foram conduzidas de forma presencial com o responsável pela loja e com dois colaboradores — um vendedor e o responsável pelo controle de estoque —, totalizando três sessões com duração média de quarenta minutos cada. A escolha por entrevistar perfis distintos teve por objetivo capturar perspectivas complementares: o gerente trouxe a visão estratégica e gerencial; o vendedor descreveu o fluxo de atendimento e registro de pedidos; e o estoquista detalhou as rotinas de entrada e saída de produtos.

Durante as sessões, dois integrantes da equipe assumiram papéis distintos: um conduziu as perguntas e manteve o diálogo com o entrevistado, enquanto o outro registrou as respostas e observações relevantes. Ao final de cada sessão, as anotações foram revisadas coletivamente para garantir que nenhuma informação relevante houvesse sido omitida ou mal compreendida.

### 3.4 Análise e Consolidação dos Resultados

Após a realização das entrevistas, as informações coletadas foram organizadas e analisadas pela equipe em uma reunião de consolidação. O processo envolveu as seguintes etapas:

- **Transcrição e organização** das anotações por tema, agrupando as respostas relacionadas a cada área funcional do sistema (clientes, produtos, pedidos, estoque, relatórios e acesso).
- **Identificação de requisitos explícitos:** necessidades claramente verbalizadas pelos entrevistados durante as sessões.
- **Identificação de requisitos implícitos:** necessidades não verbalizadas diretamente, mas inferidas a partir do fluxo operacional descrito — como a necessidade de preservar o preço unitário no momento da venda, mesmo que o preço do produto seja alterado posteriormente.
- **Eliminação de duplicidades e conflitos** entre as informações fornecidas por diferentes entrevistados, com priorização baseada na visão do gerente para os casos de divergência.
- **Validação informal** dos requisitos consolidados com o responsável pela loja, apresentando um resumo do que havia sido compreendido e solicitando confirmação ou correção.

O resultado deste processo originou os requisitos funcionais, regras de negócio e requisitos não funcionais formalizados nas subseções a seguir.

### 3.5 Requisitos Funcionais

Os requisitos funcionais descrevem as funcionalidades que o sistema deve oferecer para atender às necessidades identificadas nas entrevistas.

| ID    | Descrição |
|-------|-----------|
| RF01  | O sistema deve permitir o cadastro de clientes, incluindo nome, CPF, endereço, e-mails e telefones múltiplos. |
| RF02  | O sistema deve permitir o cadastro de produtos, com nome, preço, estoque, validade, categoria e fornecedor vinculado. |
| RF03  | O sistema deve permitir o registro de pedidos, vinculando cliente, produtos, quantidades e forma de pagamento. |
| RF04  | O sistema deve permitir a edição de dados de clientes e produtos já cadastrados. |
| RF05  | O sistema deve permitir a exclusão de clientes e produtos, com proteção contra exclusão de registros com dependências. |
| RF06  | O sistema deve permitir a consulta de clientes cadastrados, individualmente ou em listagem. |
| RF07  | O sistema deve permitir a consulta de produtos disponíveis, individualmente ou em listagem. |
| RF08  | O sistema deve gerar relatórios de vendas por período, produtos mais vendidos e clientes inadimplentes. |
| RF09  | O sistema deve controlar automaticamente o estoque dos produtos, decrementando após cada venda. |
| RF10  | O sistema deve identificar e listar clientes com débitos em aberto (pedidos `FIADO` + `PENDENTE`). |
| RF11  | O sistema deve permitir o registro e a consulta da forma de pagamento de cada pedido. |
| RF12  | O sistema deve permitir o cancelamento de pedidos, alterando seu status para `CANCELADO`. |
| RF13  | O sistema deve permitir o login de usuários autorizados por meio de autenticação com e-mail e senha. |

### 3.6 Regras de Negócio

As regras de negócio definem as restrições e os comportamentos que o sistema deve observar para garantir a consistência das operações.

| ID    | Descrição |
|-------|-----------|
| RN01  | O sistema não deve permitir o registro de pedidos quando a quantidade solicitada de um produto for superior ao saldo em estoque. |
| RN02  | O valor total do pedido deve ser calculado automaticamente pelo sistema, com base na soma de `(quantidade × preço unitário)` de cada item. |
| RN03  | Todo pedido deve estar obrigatoriamente vinculado a um cliente previamente cadastrado no sistema. |
| RN04  | O sistema deve atualizar automaticamente o estoque de cada produto após o registro de um pedido, decrementando as quantidades vendidas. |
| RN05  | O sistema deve preservar o histórico de todos os pedidos realizados, incluindo os cancelados, sem exclusão definitiva. |
| RN06  | Clientes com débitos em aberto devem ser identificados automaticamente pelo sistema, caracterizados pela combinação `status = PENDENTE` e `forma_pagamento = FIADO`. |
| RN07  | O registro da forma de pagamento é obrigatório em todo pedido, devendo ser uma das modalidades definidas: `DINHEIRO`, `CARTAO`, `PIX` ou `FIADO`. |

### 3.7 Requisitos Não Funcionais

Os requisitos não funcionais estabelecem os critérios de qualidade que o sistema deve satisfazer, independentemente das funcionalidades específicas.

| ID     | Categoria      | Descrição |
|--------|----------------|-----------|
| RNF01  | Desempenho     | O sistema deve responder às ações do usuário em até 5 segundos em ambiente de produção. |
| RNF02  | Usabilidade    | O sistema deve possuir interface de comunicação (endpoints) simples e padronizada, facilitando o consumo por front-ends futuros. |
| RNF03  | Usabilidade    | A API deve oferecer mensagens de erro descritivas e padronizadas, permitindo que o usuário compreenda e corrija a requisição. |
| RNF04  | Segurança      | O sistema deve exigir autenticação via token JWT para acesso a qualquer operação protegida. |
| RNF05  | Segurança      | Senhas de usuários devem ser armazenadas exclusivamente na forma de hash bcrypt, jamais em texto plano. |
| RNF06  | Confiabilidade | O sistema deve garantir a integridade referencial dos dados por meio de Foreign Keys, CHECK constraints e UNIQUE constraints no banco de dados. |
| RNF07  | Confiabilidade | O sistema deve permitir a recuperação de dados em caso de falhas, viabilizada pelo backup do arquivo SQLite em ambiente de desenvolvimento. |
| RNF08  | Disponibilidade| O sistema deve estar disponível durante todo o horário de funcionamento do estabelecimento, sem interrupções programadas durante o expediente. |

### 3.8 Escopo Funcional

O sistema contempla os seguintes módulos funcionais, definidos com base nos requisitos levantados:

- **Módulo de Clientes:** cadastro, edição, exclusão e consulta de clientes, com suporte a múltiplos e-mails e telefones por registro.
- **Módulo de Fornecedores:** cadastro, edição, exclusão e consulta de fornecedores, com vínculo aos produtos fornecidos.
- **Módulo de Produtos:** cadastro com controle de estoque, validade, categoria e fornecedor vinculado.
- **Módulo de Pedidos:** registro de vendas com cálculo automático de total, controle de forma de pagamento, status e histórico completo.
- **Módulo de Estoque:** movimentações automáticas (saída por venda) e manuais (entrada por reposição), com registro de histórico.
- **Módulo de Relatórios:** geração de relatórios gerenciais de vendas, inadimplência, estoque e desempenho de produtos.
- **Módulo de Autenticação:** login de usuários com geração de token JWT e controle de acesso por papel (`FUNCIONARIO` / `ADMIN`).

### 3.9 Atores do Sistema

| Ator        | Papel       | Responsabilidades principais |
|-------------|-------------|------------------------------|
| Gerente     | ADMIN       | Cadastro de usuários, acesso a relatórios gerenciais, cancelamento de pedidos, gestão de fornecedores e configurações do sistema. |
| Vendedor    | FUNCIONARIO | Cadastro e consulta de clientes, registro de pedidos, consulta de produtos e estoque, registro de formas de pagamento. |
| Estoquista  | FUNCIONARIO | Entrada de produtos no estoque, consulta de saldos e movimentações, alertas de baixa quantidade. |
| Cliente     | Externo     | Não acessa o sistema diretamente. Realiza pedidos via WhatsApp; as informações são inseridas pelos colaboradores. |
| Fornecedor  | Externo     | Não acessa o sistema diretamente. Seus dados são cadastrados pelos colaboradores para fins de rastreabilidade. |

---

## 4 Análise de Riscos

A análise de riscos tem por objetivo identificar, avaliar e estabelecer estratégias de resposta para as ameaças que possam comprometer o cronograma, a qualidade ou a entrega do projeto. Os riscos foram avaliados segundo dois critérios: **probabilidade de ocorrência** (escala de 1 a 5) e **impacto no projeto** (escala de 1 a 5). O índice de exposição ao risco é obtido pelo produto entre os dois critérios.

**Escala de referência:**

| Nível | Probabilidade / Impacto | Referência |
|-------|------------------------|------------|
| 1 | Muito baixo | Evento improvável / impacto desprezível |
| 2 | Baixo | Evento pouco provável / impacto pequeno |
| 3 | Médio | Evento possível / impacto moderado |
| 4 | Alto | Evento provável / impacto significativo |
| 5 | Muito alto | Evento muito provável / impacto crítico |

> Fonte: adaptado de Pressman e Maxim (2021).

---

### 4.1 R-01 – Desconhecimento Técnico da Equipe

| Campo | Descrição |
|-------|-----------|
| **Categoria** | Recursos Humanos / Capacitação |
| **Probabilidade** | 5 – Muito Alta |
| **Impacto** | 5 – Muito Alto |
| **Exposição (P × I)** | **25 – Crítico** |
| **Descrição** | A equipe encontra-se no segundo semestre do curso de ADS, com contato ainda incipiente com as tecnologias escolhidas: TypeScript, Node.js, Express, SQLite, JWT e Zod. A curva de aprendizado é significativa, dado que a maior parte dos integrantes não havia desenvolvido uma API REST completa anteriormente. |
| **Causas prováveis** | Ausência de disciplinas sobre APIs com Node.js no primeiro semestre; pouca experiência com Git/GitHub em ambiente colaborativo; desconhecimento de boas práticas de arquitetura em camadas. |
| **Consequências potenciais** | Atrasos no cronograma; código de baixa qualidade e difícil manutenção; retrabalho por implementações inadequadas; dificuldade na integração entre módulos. |
| **Estratégia de mitigação** | Leitura de documentação oficial e tutoriais práticos antes da implementação; divisão de responsabilidades por módulo; revisão de código entre pares via Pull Requests; comunicação ativa para compartilhar aprendizados. |
| **Plano de contingência** | Simplificar funcionalidades secundárias (relatórios avançados) para garantir a entrega do núcleo (CRUD de clientes, produtos e pedidos) dentro do prazo. |
| **Responsável** | Todos os integrantes, com acompanhamento coletivo nas reuniões de equipe. |

---

### 4.2 R-02 – Restrição de Tempo

| Campo | Descrição |
|-------|-----------|
| **Categoria** | Cronograma / Planejamento |
| **Probabilidade** | 3 – Média |
| **Impacto** | 4 – Alto |
| **Exposição (P × I)** | **12 – Alto** |
| **Descrição** | O projeto conta com aproximadamente seis meses para desenvolvimento. Embora razoável para o escopo proposto, a necessidade de primeiro aprender as tecnologias antes de aplicá-las comprime o tempo disponível para a implementação efetiva. |
| **Causas prováveis** | Subestimação da curva de aprendizado; acúmulo de compromissos acadêmicos de outras disciplinas; falhas na comunicação e divisão de tarefas; dependências entre módulos. |
| **Consequências potenciais** | Funcionalidades não implementadas no prazo; qualidade de código comprometida por pressão de tempo; documentação elaborada às pressas. |
| **Estratégia de mitigação** | Priorização das funcionalidades por criticidade (núcleo antes de complementares); branches por feature para desenvolvimento paralelo; definição de marcos intermediários de entrega. |
| **Plano de contingência** | Reduzir o escopo das funcionalidades menos críticas (relatórios avançados, soft delete, controle de acesso granular) para garantir a entrega do núcleo no prazo. |
| **Responsável** | Todos os integrantes; revisão coletiva do progresso a cada duas semanas. |

---

### 4.3 R-03 – Requisitos de Legislação (LGPD)

| Campo | Descrição |
|-------|-----------|
| **Categoria** | Conformidade Legal / Regulatória |
| **Probabilidade** | 2 – Baixa |
| **Impacto** | 3 – Médio |
| **Exposição (P × I)** | **6 – Médio** |
| **Descrição** | A LGPD (Lei n.º 13.709/2018) impõe obrigações ao tratamento de dados pessoais de clientes e fornecedores. O sistema armazena CPF, e-mail, endereço e CNPJ. Como projeto acadêmico sem implantação comercial, o impacto imediato é reduzido, mas deve ser considerado para versões futuras. |
| **Causas prováveis** | Tratamento de dados sensíveis (CPF) sem consentimento explícito; ausência de política de retenção e descarte de dados; armazenamento sem criptografia de campos além da senha. |
| **Consequências potenciais** | Em produção: sanções administrativas e reputacionais. Em contexto acadêmico: necessidade de adequação antes de qualquer implantação real. |
| **Estratégia de mitigação** | Senhas com hash bcrypt; HTTPS em produção; validação e sanitização de dados de entrada; não exposição de dados sensíveis em logs ou mensagens de erro. |
| **Plano de contingência** | Para versão em produção: implementar consentimento de coleta de dados, política de exclusão a pedido do titular e criptografia adicional. Consultar profissional jurídico antes da implantação comercial. |
| **Responsável** | Integrante responsável pelo módulo de autenticação e segurança. |

---

### 4.4 R-04 – Restrições Financeiras

| Campo | Descrição |
|-------|-----------|
| **Categoria** | Financeiro / Recursos |
| **Probabilidade** | 1 – Muito Baixa |
| **Impacto** | 1 – Muito Baixo |
| **Exposição (P × I)** | **1 – Desprezível** |
| **Descrição** | Projeto acadêmico sem fins comerciais. Todas as ferramentas são de código aberto e gratuitas. O ambiente de desenvolvimento é local e o repositório é hospedado gratuitamente no GitHub. |
| **Causas prováveis** | Eventual necessidade de infraestrutura em nuvem para demonstração; aquisição de ferramentas pagas não previstas. |
| **Consequências potenciais** | Custo adicional não previsto em caso de hospedagem remota para apresentação final. |
| **Estratégia de mitigação** | Utilizar exclusivamente ferramentas gratuitas: Node.js, TypeScript, Express, SQLite, JWT, Zod, bcryptjs e GitHub. Para demonstração, executar localmente ou usar plataformas free tier (Railway, Render). |
| **Plano de contingência** | Manter o desenvolvimento em ambiente local durante o semestre. Avaliar opções gratuitas de hospedagem caso a apresentação exija deploy. |
| **Responsável** | Não requer monitoramento ativo dado o nível de exposição desprezível. |

---

### 4.5 Síntese da Análise de Riscos

| ID   | Risco                    | Prob. | Impacto | P × I | Classificação  |
|------|--------------------------|:-----:|:-------:|:-----:|----------------|
| R-01 | Desconhecimento Técnico  |   5   |    5    |  25   | Crítico        |
| R-02 | Restrição de Tempo       |   3   |    4    |  12   | Alto           |
| R-03 | LGPD / Legislação        |   2   |    3    |   6   | Médio          |
| R-04 | Restrições Financeiras   |   1   |    1    |   1   | Desprezível    |

A análise evidencia que o risco de maior exposição é o **desconhecimento técnico da equipe (R-01)**, classificado como crítico com índice 25. Este risco é inerente ao contexto acadêmico do segundo semestre e foi endereçado por meio da divisão de responsabilidades por módulo e da adoção de práticas de revisão de código. O risco de **restrição de tempo (R-02)**, com índice 12, foi mitigado pela priorização das funcionalidades críticas e pelo uso de desenvolvimento paralelo com branches por feature. Os riscos **legislativo (R-03)** e **financeiro (R-04)** apresentam exposição reduzida dado o caráter acadêmico do projeto, não requerendo ações imediatas além das boas práticas já adotadas.

---

## 5 Considerações Finais

Este documento consolidou as atividades correspondentes à primeira fase do Modelo Cascata: o Levantamento de Requisitos e a Análise de Riscos. Por meio da técnica de entrevista, foi possível compreender o fluxo operacional do estabelecimento, identificar os problemas existentes e traduzi-los em requisitos formalizados, que servirão de referência para todas as fases subsequentes do desenvolvimento.

A especificação formal dos treze requisitos funcionais, das sete regras de negócio e dos oito requisitos não funcionais fornece a base necessária para que a próxima fase — o **Projeto** — possa tomar decisões arquiteturais e de modelagem fundamentadas nas reais necessidades do usuário, reduzindo o risco de retrabalho decorrente de requisitos mal compreendidos ou omitidos.

A análise de riscos revelou que o principal desafio do projeto não é de natureza financeira ou regulatória, mas sim **técnica e temporal**: a equipe precisa conciliar o aprendizado das tecnologias escolhidas com a implementação efetiva do sistema dentro do prazo disponível. As estratégias de mitigação adotadas — divisão modular de responsabilidades, revisão de código por Pull Requests, priorização de funcionalidades e marcos intermediários de acompanhamento — foram concebidas especificamente para endereçar este cenário.

Os requisitos especificados neste documento orientarão a próxima fase do Modelo Cascata: o **Projeto**, na qual serão definidas a arquitetura da solução, a modelagem de dados, a escolha definitiva das tecnologias e o cálculo da estimativa de esforço por meio de Pontos de Função.

---
