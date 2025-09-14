import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
export async function GET(request: Request){ const { searchParams } = new URL(request.url); const repoId = searchParams.get('repoId') || undefined; const findings = await prisma.finding.findMany({ where: repoId ? { repoId } : undefined, orderBy:{ createdAt:'desc' } }); return NextResponse.json(findings) }