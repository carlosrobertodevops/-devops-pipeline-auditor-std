import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
async function ensureSeed(){ const c = await prisma.repo.count(); if(!c){ const org = await prisma.org.upsert({ where:{ externalId:'demo-org' }, update:{}, create:{ name:'Demo Org', externalId:'demo-org' } }); await prisma.repo.create({ data:{ orgId:org.id, name:'example', fullName:'demo/example', defaultBranch:'main', score:72 } }) } }
export async function GET(){ await ensureSeed(); const repos = await prisma.repo.findMany({ orderBy:{ createdAt:'desc' } }); return NextResponse.json(repos) }