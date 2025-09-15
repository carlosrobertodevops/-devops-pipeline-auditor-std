# DevOps Pipeline Auditor — STD (Next.js 15 + Tailwind • NestJS + Prisma)

SaaS B2B para **auditar pipelines de CI/CD** (MVP: GitHub Actions), identificar riscos e sugerir correções (ex.: abrir PRs automáticos).  
Monorepo organizado com **frontend** em Next.js 15 (App Router + Tailwind) e **backend** em NestJS + Prisma + PostgreSQL.

---

## 🧱 Stack

- **Frontend:** Next.js 15 • App Router • **Tailwind CSS**
- **Backend:** NestJS 10 • Prisma 5 • Express
- **Banco:** PostgreSQL 16
- **Infra Dev/Prod:** Docker Compose (ambiente local) e **Coolify** (produção com Compose)
- **Linguagens:** TypeScript end-to-end

---

## 📂 Estrutura de Pastas

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
---

## ⚙️ Pré-requisitos

- **Docker** e **Docker Compose** instalados
- (Opcional) Node.js **v20**+ caso rode sem Docker

---

## 🚀 Subir ambiente de desenvolvimento (Docker)

1) **Copie** os exemplos de ambiente:
```bash
cp src/.env.example src/.env
cp api/.env.example api/.env
