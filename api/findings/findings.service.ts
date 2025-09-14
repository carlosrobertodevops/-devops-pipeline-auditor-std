import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class FindingsService {
  constructor(private prisma: PrismaService){}

  list(repoId?: string){
    return this.prisma.finding.findMany({
      where: repoId ? { repoId } : undefined,
      orderBy: { createdAt: 'desc' }
    })
  }

  async addDemo(repoId: string){
    const has = await this.prisma.finding.count({ where: { repoId } })
    if (has===0){
      await this.prisma.finding.createMany({
        data: [
          { repoId, rule: 'ACTION_NOT_PINNED', severity: 'HIGH', file: '.github/workflows/ci.yml', line: 12, suggestion: 'Use SHA pin in uses:' },
          { repoId, rule: 'MISSING_PERMISSIONS', severity: 'MEDIUM', file: '.github/workflows/ci.yml', line: 1, suggestion: 'Add permissions: read-all' }
        ]
      })
    }
  }
}
