
# devops-pipeline-auditor-std

```
devops-pipeline-auditor-std/
|─ src/                      # Next.js 15 (src/app)
│  ├─ app/(routes)/{dashboard,repositories,findings}/page.tsx
│  ├─ app/layout.tsx
│  ├─ lib/api.ts
│  ├─ styles/globals.css
│  ├─ .env.example
│  ├─ package.json, tsconfig.json, next.config.mjs, Dockerfile
├─ api/                      # NestJS + Prisma
│  ├─ common/{prisma.service.ts,health.controller.ts}
│  ├─ {app.module.ts, main.ts}
│  ├─ repos/{repos.module.ts, repos.controller.ts, repos.service.ts}
│  ├─ findings/{findings.module.ts, findings.controller.ts, findings.service.ts}
│  ├─ scans/{scans.module.ts, scans.controller.ts, scans.service.ts}
│  ├─ webhooks/{webhooks.module.ts, webhooks.controller.ts}
│  ├─ prisma/schema.prisma
│  ├─ scripts/seed.ts
│  ├─ .env.example
│  ├─ package.json, tsconfig.json, nest-cli.json, Dockerfile
├─ docs/README.md
├─ docker-compose.local.yml        # dev: db + api + web
├─ docker-compose.coolify.yml      # Coolify: api + web (DB gerenciado)
└─ README.md
```


