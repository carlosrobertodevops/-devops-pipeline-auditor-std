import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { FindingsService } from '../findings/findings.service'

@Injectable()
export class ScansService {
  constructor(private prisma: PrismaService, private findings: FindingsService){}

  async trigger(repoId: string){
    const scan = await this.prisma.scan.create({ data: { repoId, status: 'DONE', score: 75 } })
    await this.findings.addDemo(repoId)
    await this.prisma.repo.update({ where: { id: repoId }, data: { score: 75 } })
    return scan
  }
}
