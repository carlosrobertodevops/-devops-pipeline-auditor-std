
# devops-pipeline-auditor-std

```
devops-pipeline-auditor-std/
├─ web/                         # Next.js 14 (App Router) com src/app
│  ├─ src/app/{dashboard,findings,repositories}/page.tsx
│  ├─ src/app/{layout.tsx,page.tsx}
│  ├─ src/lib/api.ts
│  ├─ src/styles/globals.css
│  ├─ package.json, tsconfig.json, next.config.mjs, .env.example, Dockerfile
│
├─ api/                         # NestJS + Prisma
│  ├─ src/common/{prisma.service.ts,health.controller.ts}
│  ├─ src/repos/{repos.module.ts,repos.controller.ts,repos.service.ts}
│  ├─ src/findings/{findings.module.ts,findings.controller.ts,findings.service.ts}
│  ├─ src/scans/{scans.module.ts,scans.controller.ts,scans.service.ts}
│  ├─ src/webhooks/{webhooks.module.ts,webhooks.controller.ts}
│  ├─ src/{app.module.ts,main.ts}
│  ├─ prisma/{schema.prisma,seed.ts}
│  ├─ package.json, tsconfig.json, .env.example, Dockerfile
│
├─ docs/                        # Documentação (visão, arquitetura, API, deploy)
├─ docker-compose.local.yml     # Dev: Postgres + Nest API + Next Web
├─ docker-compose.coolify.yml   # Prod (Coolify): API + Web
└─ README.md

```
