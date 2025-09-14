import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
export async function GET(){ const now = await prisma.$queryRaw`select now()`; return NextResponse.json({ status:'ok', db: now }) }