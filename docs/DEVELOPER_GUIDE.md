
# Guia do Desenvolvedor

## Monorepo
- Front: `src/` (Next.js 15 + Tailwind)
- API: `api/` (NestJS + Prisma + Stripe)

## OpenAPI / Swagger
- UI: `GET /docs`
- JSON: gerar localmente com `npm run openapi:gen` dentro de `api/`.
- CI publica `api/openapi.json` como artifact.

## CI/CD
- `ci.yml`: build front e API + gera OpenAPI.
- `docker-publish.yml`: build & push imagens para GHCR.
- `deploy-coolify.yml`: dispara webhooks do Coolify (defina secrets `COOLIFY_WEBHOOK_API` e `COOLIFY_WEBHOOK_WEB`).

## Limites por plano
- `api/billing/plan.utils.ts`: tabela com limites.
- `api/billing/plan.guard.ts`: guard que aplica limite no endpoint de Scan e criação de repositórios.
- Ajuste para usar org do usuário autenticado quando integrar Auth.

## Auth por API Key
- Envie `x-api-key` em todas as requests. Veja `docs/AUTH.md`.

