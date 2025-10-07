# Backend Super1 Test — Guia de Uso (Português)

Este repositório contém uma API HTTP construída com Elysia (Bun) seguindo arquitetura em camadas (Transport / Service / Repository) e usando PostgreSQL com Drizzle ORM. Este README descreve como configurar o ambiente, rodar a aplicação e executar os testes.


## Requisitos

- Bun (runtime e gerenciador de pacotes)
  - Instalação: https://bun.sh
- Docker e Docker Compose (para PostgreSQL local)
- PostgreSQL (opcional, apenas se preferir não usar Docker)
- Node.js não é necessário para executar; o projeto roda com Bun.


## Começando

1) Instale as dependências

```bash
bun install
```

2) Suba o banco de dados (via Docker)

```bash
docker compose up -d
```

O serviço padrão cria:
- host: localhost
- porta: 5432
- usuário: dbuser
- senha: dbpass
- database: dbsuper

3) Crie o arquivo .env na raiz

```bash
cp .env.example .env
```

Conteúdo mínimo recomendado não necessário (exemplo):

```
# Ambiente
APP_ENV=development
HTTP_PORT=3333
LOG_LEVEL=info

# Banco de dados (compatível com docker-compose.yml)
DATABASE_URL=postgres://dbuser:dbpass@localhost:5432/dbsuper

# Autenticação (ajuste conforme sua necessidade)
JWT_SECRET=change-me
JWT_ISSUER=super1
JWT_AUDIENCE=super1-clients
JWT_EXPIRES_IN=1h
```

4) Gere/aplique as migrações do banco

- Gerar migrações a partir do schema (quando houver mudanças de esquema):

```bash
bun run db:generate
```

- Aplicar migrações:

```bash
bun run db:migrate
```

Observação: os comandos usam drizzle-kit com variáveis do .env. Confira a URL do banco em DATABASE_URL.


## Rodando a aplicação

- Ambiente de desenvolvimento (hot reload):

```bash
bun run dev
```

- Ambiente padrão (sem hot reload):

```bash
bun run start
```

A aplicação iniciará por padrão em http://localhost:3333 (ajustável via HTTP_PORT).

Ao subir, você verá no console algo como:

```
HTTP listening on http://localhost:3333 (env=development)
```


## Testes

Os testes são executados com o comando integrado do Bun.

- Executar todos os testes:

```bash
bun test
```

- Executar em modo de ambiente de teste (já configurado no script):

```bash
NODE_ENV=test bun test
```

Estrutura básica dos testes (diretório tests/):
- tests/suites/...: casos de teste (unitários, de integração e funcionais via HTTP)
- tests/testhelpers/...: utilitários para API e banco (fixtures)

Dicas:
- Certifique-se de que o banco esteja acessível (ex.: docker compose up -d postgres) quando rodar testes de integração.
- Use um banco separado para testes, se necessário, ajustando DATABASE_URL no ambiente de teste.


## Scripts disponíveis

Conforme package.json:

- dev: bun --hot index.ts
- start: bun run index.ts
- test: NODE_ENV=test bun test
- db:generate: bun --env-file .env --bun drizzle-kit generate
- db:migrate: bun --env-file .env --bun drizzle-kit migrate


## Variáveis de ambiente

As variáveis são validadas em src/config/env.ts. Principais chaves:
- APP_ENV: development | test | production (opcional)
- NODE_ENV: development | test | production (opcional)
- HTTP_PORT: porta HTTP (opcional; padrão 3333)
- LOG_LEVEL: debug | info | warn | error (opcional; padrão info)
- DATABASE_URL: URL do PostgreSQL (obrigatória)
- JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE, JWT_EXPIRES_IN: parâmetros de autenticação (opcionais)

Exemplo de DATABASE_URL compatível com o docker-compose deste projeto:

```
postgres://dbuser:dbpass@localhost:5432/dbsuper
```


## Arquitetura (visão geral)

- Transport (HTTP): Elysia — configuração de rotas, autenticação, serialização e documentação (Swagger).
- Service: regras de negócio e orquestração de repositórios/adapters/providers; validações de entrada.
- Repository: acesso a dados com Drizzle ORM (PostgreSQL), queries explícitas por caso de uso.

Ponto de entrada: index.ts
- Carrega configuração (src/config/config.ts)
- Cria a aplicação Elysia (src/transport/http/elysiaapp/app.ts)
- Sobe o servidor na porta configurada

Banco de dados:
- Client Drizzle: src/repositories/drizzle/client.ts
- Migrations: src/repositories/drizzle/migrations/
- Schemas: src/repositories/drizzle/schema/


## Troubleshooting

- Erro de conexão com o banco (ECONNREFUSED):
  - Verifique se o container do PostgreSQL está rodando: `docker ps`
  - Confirme a URL em DATABASE_URL e a porta 5432 exposta.

- Migrações não encontradas ou falhando:
  - Rode `bun run db:generate` após mudanças de schema e depois `bun run db:migrate`.
  - Confirme se a variável `DATABASE_URL` está no `.env`.

- Porta já em uso ao iniciar a API:
  - Ajuste `HTTP_PORT` no `.env` (ex.: 3000, 4000).

- Problemas com JWT/autenticação:
  - Defina `JWT_SECRET` e demais variáveis se a autenticação estiver habilitada em rotas específicas.

