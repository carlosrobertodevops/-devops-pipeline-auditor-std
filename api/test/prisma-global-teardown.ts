import { PrismaClient } from '@prisma/client'

module.exports = async () => {
  const meta = (global as any).__PRISMA_TEST_SCHEMA__ as { base: string; schema: string } | undefined
  if (!meta) return

  // Conecta no mesmo DB base e derruba o schema criado
  const client = new PrismaClient({
    datasources: { db: { url: `${meta.base}?schema=${meta.schema}` } }
  })
  try {
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${meta.schema}" CASCADE;`)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('WARN(drop schema):', e)
  } finally {
    await client.$disconnect()
  }
}