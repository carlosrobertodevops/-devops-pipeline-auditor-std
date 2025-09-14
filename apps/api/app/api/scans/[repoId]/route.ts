import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
type Params = { params: { repoId: string } }
export async function POST(_: Request, { params }: Params){ const { repoId } = params; const scan = await prisma.scan.create({ data:{ repoId, status:'DONE', score:75 } }); const has = await prisma.finding.count({ where:{ repoId } }); if(!has){ await prisma.finding.createMany({ data:[
  { repoId, rule:'ACTION_NOT_PINNED', severity:'HIGH', file:'.github/workflows/ci.yml', line:12, suggestion:'Use SHA pin in uses:' },
  { repoId, rule:'MISSING_PERMISSIONS', severity:'MEDIUM', file:'.github/workflows/ci.yml', line:1, suggestion:'Add permissions: read-all' },
]}) } await prisma.repo.update({ where:{ id: repoId }, data:{ score:75 } }); return NextResponse.json(scan) }