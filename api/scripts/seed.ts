import { PrismaClient, Plan } from '@prisma/client'
import crypto from 'crypto'
const prisma = new PrismaClient()

async function main(){
  const apiKey = crypto.randomBytes(24).toString('hex')

  const org = await prisma.org.upsert({
    where: { externalId: 'demo-org' },
    update: {},
    create: { name: 'Demo Org', externalId: 'demo-org', plan: Plan.FREE, apiKey }
  })

  // garante apiKey
  if (!org.apiKey){
    await prisma.org.update({ where: { id: org.id }, data: { apiKey } })
  }

  const repo = await prisma.repo.upsert({
    where: { fullName: 'demo/example' },
    update: {},
    create: { orgId: org.id, name: 'example', fullName: 'demo/example', defaultBranch: 'main', score: 72 }
  })

  const exists = await prisma.finding.count({ where: { repoId: repo.id } })
  if (exists === 0){
    await prisma.finding.createMany({
      data: [
        { repoId: repo.id, rule: 'ACTION_NOT_PINNED', severity: 'HIGH', file: '.github/workflows/ci.yml', line: 12, suggestion: 'Use SHA pin in uses:' },
        { repoId: repo.id, rule: 'MISSING_PERMISSIONS', severity: 'MEDIUM', file: '.github/workflows/ci.yml', line: 1, suggestion: 'Add permissions: read-all' }
      ]
    })
  }

  console.log('Seed concluído.')
  const refreshed = await prisma.org.findUnique({ where: { id: org.id } })
  console.log('Org:', { id: refreshed?.id, externalId: refreshed?.externalId, apiKey: refreshed?.apiKey, plan: refreshed?.plan })
}

main().finally(async ()=>{ await prisma.$disconnect() })
