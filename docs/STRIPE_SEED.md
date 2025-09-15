
# Stripe Seed (Products & Prices)

## Pré-requisitos
- `STRIPE_SECRET_KEY` configurada no ambiente (sk_test_...).
- Node 20+.

## Rodar
```bash
cd api
export STRIPE_SECRET_KEY=sk_test_xxx
# opcional: escrever no api/.env automaticamente
# export WRITE_ENV=1
npm run ts-node -- scripts/stripe-seed.ts

