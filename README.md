# Super1 Test — Visão Geral

Este repositório contém a solução de um teste técnico para a empresa Super1. O foco principal está no backend (pasta `backend/`), com qualidade assegurada por lint, build e testes automatizados via GitHub Actions.

## Objetivo do projeto
- Demonstrar habilidades em desenvolvimento backend utilizando Bun/TypeScript.
- Garantir qualidade de código (lint + type-check via bundler) e confiabilidade (testes automatizados e migrações de banco).

## Estrutura (recorte relevante)
- `backend/` — código-fonte do backend, testes, configurações e scripts.
  - `src/` — código de aplicação (domínios, serviços, providers, transporte HTTP, etc.).
  - `tests/` — suites de testes e utilitários.
  - Outros arquivos de configuração (p. ex., `bun.lock`, scripts e migrações).
- `.github/workflows/` — automações do GitHub Actions para lint, build e testes.

## Como chegar ao README do backend
1. Navegue até a pasta `backend/` na raiz do repositório.
2. Abra o arquivo `backend/README.md` (quando presente) para detalhes específicos de instalação, execução e decisões técnicas do backend.
   - Atalho: tente o link relativo `backend/README.md` pela interface do GitHub.
   - Caso o link não abra, significa que o README específico do backend ainda não foi publicado; use as instruções abaixo e os scripts do `package.json`/Bun conforme necessário.

## Workflow do GitHub (Checks)
O repositório possui um workflow de verificação automática em `.github/workflows/checks-backend.yml`, com os seguintes pontos-chave:

- Disparo (triggers):
  - `pull_request` que altera arquivos dentro de `backend/**`.
  - `workflow_dispatch` (execução manual pela interface do GitHub).

- Concurrency:
  - Cancela execuções anteriores do mesmo PR para economizar tempo.

- Ambiente base:
  - Runner `ubuntu-latest`.
  - Usa Bun `1.2.22` e cacheia dependências para builds mais rápidos.

- Jobs e etapas principais:
  1) setup
     - Checkout do código, instalação do Bun e das dependências com `bun install --frozen-lockfile`.
     - Configuração de cache do Bun.
  2) lint
     - Executa Biome: `bunx --bun biome check --reporter=github .` para garantir formatação/padrões e sinalizar problemas no PR.
  3) build
     - Realiza um bundle (também atuando como type-check) com: `bun build ./index.ts --outdir dist --target=bun`.
  4) test
     - Sobe um PostgreSQL via `docker compose` (serviço `postgres`).
     - Aguarda o banco ficar pronto e cria `.env` de teste com `DATABASE_URL`, `APP_ENV` e `NODE_ENV`.
     - Executa migrações: `bun db:migrate`.
     - Roda os testes: `bun test --timeout=60000`.
     - Finaliza derrubando os serviços: `docker compose down -v`.

Esse fluxo garante que todo PR que altere o backend passe por lint, build e testes, com banco real em container, antes de ser integrado.

## Rodando localmente (resumo)
- Pré-requisitos: Bun instalado e Docker (para banco local via compose).
- Entre em `backend/` e instale as dependências: `bun install`.
- Configure as variáveis de ambiente (ex.: `DATABASE_URL`).
- Suba o banco com Docker Compose (se aplicável) e rode as migrações: `bun db:migrate`.
- Rode os testes: `bun test`.
- Inicie a aplicação conforme instruções do backend (ver `backend/README.md` quando disponível).

---

Dúvidas ou sugestões: abra uma issue ou inicie uma discussão no repositório.
