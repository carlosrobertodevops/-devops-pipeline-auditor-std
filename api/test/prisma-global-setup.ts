import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

/**
 * Cria um schema efêmero para testes E2E/integração.
 * Usa TEST_DATABASE_URL como base (sem ?schema=).
 * Ex.: TEST_DATABASE_URL=postgresql://dev:dev@localhost:5432/platform
 */
module.exports = async () => {
  const base = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
  if (!base) {
    throw new Error('Defina TEST_DATABASE_URL ou DATABASE_URL para testes.')
  }

  const schema = `test_${randomUUID().replace(/-/g, '')}`
  const url = `${base}?schema=${schema}`
  process.env.DATABASE_URL = url

  // Gera client e aplica o schema do Prisma desta API
  execSync(`npx prisma generate --schema ./prisma/schema.prisma`, { stdio: 'inherit' })
  execSync(`npx prisma db push --schema ./prisma/schema.prisma`, { stdio: 'inherit' })

  ;(global as any).__PRISMA_TEST_SCHEMA__ = { base, schema }
}