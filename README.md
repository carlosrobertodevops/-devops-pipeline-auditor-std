
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
devops-pipeline-auditor-std/
├─ src/                                            ← Next.js 15 (App Router + Tailwind)
│  ├─ app/
│  │  ├─ (routes)/
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ repositories/page.tsx                 ← CreateRepoInput ajustado
│  │  │  ├─ findings/page.tsx
│  │  │  └─ billing/
│  │  │     ├─ page.tsx
│  │  │     └─ subscriptions/page.tsx
│  │  ├─ auth/login/page.tsx                      ← tela de login
│  │  ├─ profile/page.tsx                         ← perfil do usuário
│  │  ├─ layout.tsx                               ← import '../styles/globals.css'
│  │  └─ page.tsx
│  ├─ lib/api.ts                                  ← createCheckout/createPortal/getRepos/...
│  ├─ styles/globals.css                          ← base + componentes utilitários
│  ├─ tailwind.config.ts
│  ├─ postcss.config.js
│  ├─ next.config.mjs
│  ├─ tsconfig.json
│  ├─ package.json
│  ├─ .env.example                                ← NEXT_PUBLIC_API_URL / STRIPE_PUBLIC_KEY
│  ├─ Dockerfile
│  └─ .dockerignore
│
├─ api/                                           ← NestJS + Prisma + Stripe + OTel
│  ├─ app.module.ts
│  ├─ main.ts                                     ← Swagger + OpenAPI + raw body Stripe
│  ├─ auth/
│  │  ├─ auth.module.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  ├─ jwt.strategy.ts
│  │  ├─ jwt.guard.ts
│  │  └─ dto/{login.dto.ts,register.dto.ts,update-profile.dto.ts}
│  ├─ billing/
│  │  ├─ billing.module.ts
│  │  ├─ billing.controller.ts
│  │  ├─ billing.service.ts
│  │  ├─ plan.guard.ts
│  │  └─ plan.utils.ts
│  ├─ common/{prisma.service.ts,health.controller.ts}
│  ├─ repos/{repos.module.ts,repos.controller.ts,repos.service.ts}
│  ├─ findings/{findings.module.ts,findings.controller.ts,findings.service.ts}
│  ├─ scans/{scans.module.ts,scans.controller.ts,scans.service.ts}
│  ├─ webhooks/{webhooks.module.ts,webhooks.controller.ts}
│  ├─ observability/
│  │  ├─ observability.module.ts
│  │  ├─ observability.controller.ts              ← /observability/info
│  │  └─ tracing.ts                               ← OTel + Prometheus (porta 9464)
│  ├─ prisma/schema.prisma                        ← generator com ["native","linux-musl"]
│  ├─ scripts/{seed.ts,generate-openapi.ts,stripe-seed.ts}
│  ├─ types/{passport.d.ts,passport-jwt.d.ts}     ← d.ts locais p/ build TS
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ nest-cli.json
│  ├─ .env.example                                ← DATABASE_URL / JWT_SECRET / STRIPE_*
│  ├─ Dockerfile                                  ← patch binaryTargets + prisma generate
│  └─ .dockerignore
│
├─ observability/
│  ├─ prometheus/prometheus.yml                   ← scrape http://api:9464/metrics
│  └─ grafana/provisioning/
│     ├─ datasources/datasource.yml               ← Prometheus DS
│     └─ dashboards/dpa-overview.json             ← latência, RPS, erros
│
├─ docs/{README.md,USER_MANUAL.md,DEVELOPER_GUIDE.md,STRIPE_SEED.md,AUTH.md,OPENAPI.md,openapi.yaml}
├─ .github/workflows/{ci.yml,docker-publish.yml,deploy-coolify.yml}
├─ docker-compose.local.yml                       ← dev: db + api + web + prometheus + grafana
├─ docker-compose.coolify.yml                     ← prod/self-host (Coolify)
├─ .gitignore
└─ README.md

```
---


## ⚙️ Pré-requisitos

- **Docker** e **Docker Compose** instalados
- (Opcional) Node.js **v20**+ caso rode sem Docker

---

## 🚀 Subir ambiente de desenvolvimento (Docker)

```
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

