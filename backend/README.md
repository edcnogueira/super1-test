# Backend API

Elysia setup with health check and OpenAPI docs, following the layered architecture guidelines.

## Requirements
- Bun 1.0+

## Install dependencies
```bash
bun install
```

## Run in development (hot reload)
```bash
bun run dev
```

## Run in production mode
```bash
bun run start
```

## Configuration
Environment variables (all optional):
- APP_ENV: application environment (default: development)
- HTTP_PORT: HTTP port (default: 3000)
- LOG_LEVEL: debug | info | warn | error (default: info)

## Endpoints
- GET /health → { "status": "ok" }
- Swagger UI: GET /docs

All code, identifiers, comments, and messages are in English by convention.
