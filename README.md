
# devops-pipeline-auditor-std

```
devops-pipeline-auditor-std/
├─ src/                      # Next.js 15 (src/app)
│  ├─ app/(routes)/dashboard/page.tsx
│  ├─ app/(routes)/repositories/page.tsx
│  ├─ app/(routes)/findings/page.tsx
│  ├─ app/layout.tsx
│  ├─ app/page.tsx
│  ├─ lib/api.ts
│  ├─ styles/globals.css
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ next.config.mjs
│  └─ Dockerfile
├─ api/                      # NestJS + Prisma
│  ├─ common/prisma.service.ts
│  ├─ common/health.controller.ts
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ repos/{repos.module.ts, repos.controller.ts, repos.service.ts}
│  ├─ findings/{findings.module.ts, findings.controller.ts, findings.service.ts}
│  ├─ scans/{scans.module.ts, scans.controller.ts, scans.service.ts}
│  ├─ webhooks/{webhooks.module.ts, webhooks.controller.ts}
│  ├─ prisma/schema.prisma
│  ├─ scripts/seed.ts
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ nest-cli.json
│  └─ Dockerfile
├─ docs/README.md
├─ docker-compose.local.yml        # dev: db + api + web
├─ docker-compose.coolify.yml      # Coolify: api + web (DB gerenciado)
└─ README.md
```
# Documentação

## Stack
- Frontend: Next.js 15 + Tailwind CSS (App Router)
- Backend: NestJS 10 + Prisma 5
- DB: PostgreSQL
- Docker: Compose (dev) e Coolify (prod)

## Endpoints
- GET /health
- GET /repos
- POST /scans/:repoId
- GET /findings?repoId=...
- POST /webhooks/github

## Entidades (Prisma)
Org, Repo, Workflow, Scan, Finding.

# DevOps Pipeline Auditor — STD (Tailwind)
Layout **src/** (Next.js 15, App Router, Tailwind) + **api/** (NestJS + Prisma).
Compose para **dev** e Coolify para **prod**.

## Rodar local
```bash
docker compose -f docker-compose.local.yml up -d --build
# Web: http://localhost:3000
# API: http://localhost:3001
