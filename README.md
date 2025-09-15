
# DevOps Pipeline Auditor — STD (Next.js 15 + Tailwind • NestJS + Prisma)

SaaS B2B para **auditar pipelines de CI/CD** (MVP: GitHub Actions), identificar riscos e sugerir correções (ex.: abrir PRs automáticos).  
Monorepo organizado com **frontend** em Next.js 15 (App Router + Tailwind) e **backend** em NestJS + Prisma + PostgreSQL.

## 🧱 Stack

- **Frontend:** Next.js 15 • App Router • **Tailwind CSS**
- **Backend:** NestJS 10 • Prisma 5 • Express
- **Banco:** PostgreSQL 16
- **Infra Dev/Prod:** Docker Compose (ambiente local) e **Coolify** (produção com Compose)
- **Linguagens:** TypeScript end-to-end

## 📂 Estrutura de Pastas

# devops-pipeline-auditor-std

---
```

```
---


## ⚙️ Pré-requisitos

- **Docker** e **Docker Compose** instalados
- (Opcional) Node.js **v20**+ caso rode sem Docker

---

## 🚀 Subir ambiente de desenvolvimento (Docker)

```
devops-pipeline-auditor-std/
├─ src/                                   # Next.js 15 (App Router)
│  ├─ app/(routes)/dashboard/page.tsx
│  ├─ app/(routes)/repositories/page.tsx      ← (ajustado p/ CreateRepoInput)
│  ├─ app/(routes)/findings/page.tsx
│  ├─ app/(routes)/billing/page.tsx
│  ├─ app/(routes)/billing/subscriptions/page.tsx
│  ├─ app/layout.tsx                          ← (import '../styles/globals.css')
│  ├─ app/page.tsx
│  ├─ lib/api.ts                              ← (adicionado: createCheckout, getRepos, etc.)
│  ├─ styles/globals.css                      ← (padrão que você pediu)
│  ├─ tailwind.config.ts
│  ├─ postcss.config.js
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ next.config.mjs
│  └─ Dockerfile                              ← (build de produção do web)
├─ api/                                   # NestJS + Prisma + Stripe + OTel + Swagger
│  ├─ auth/{auth.module.ts,auth.controller.ts,auth.service.ts,jwt.strategy.ts}
│  ├─ billing/{billing.module.ts,billing.service.ts,billing.controller.ts,plan.guard.ts,plan.utils.ts}
│  ├─ common/{prisma.service.ts,health.controller.ts}
│  ├─ repos/{repos.module.ts,repos.controller.ts,repos.service.ts}
│  ├─ findings/{findings.module.ts,findings.controller.ts,findings.service.ts}
│  ├─ scans/{scans.module.ts,scans.controller.ts,scans.service.ts}
│  ├─ webhooks/{webhooks.module.ts,webhooks.controller.ts}
│  ├─ observability/{observability.module.ts,tracing.ts}   ← (OTel Prometheus)
│  ├─ prisma/schema.prisma
│  ├─ scripts/{seed.ts,generate-openapi.ts,stripe-seed.ts}
│  ├─ {app.module.ts, main.ts}                             ← (Swagger + /openapi.* + CORS)
│  ├─ types/{passport.d.ts,passport-jwt.d.ts}              ← (tipos locais p/ build TS)
│  ├─ .env.example
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ nest-cli.json
│  └─ Dockerfile
├─ docs/{README.md,USER_MANUAL.md,DEVELOPER_GUIDE.md,STRIPE_SEED.md,AUTH.md}
├─ .github/workflows/{ci.yml,docker-publish.yml,deploy-coolify.yml}
├─ docker-compose.local.yml
├─ docker-compose.coolify.yml
├─ .gitignore
└─ README.md
```

1) **Copie** os exemplos de ambiente:
---
---
```bash
cp src/.env.example src/.env
cp api/.env.example api/.env
```
---
# Documentação (Billing + Stripe)

Endpoints:
- POST /billing/checkout
- POST /billing/portal
- POST /webhooks/stripe

Variáveis (`api/.env`):
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_BASIC, STRIPE_PRICE_PRO, STRIPE_PRICE_ENTERPRISE
- FRONTEND_URL (lista CORS, separada por vírgula)

