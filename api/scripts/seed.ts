import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  const org = await prisma.org.upsert({
    where: { externalId: 'demo-org' },
    update: {},
    create: { name: 'Demo Org', externalId: 'demo-org' }
  })

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
}

main().finally(async ()=>{ await prisma.$disconnect() })
