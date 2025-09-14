import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class ReposService {
  constructor(private prisma: PrismaService){}

  listRepos(){
    return this.prisma.repo.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async ensureSeed(){
    const count = await this.prisma.repo.count()
    if (count===0){
      const org = await this.prisma.org.upsert({
        where: { externalId: 'demo-org' }, update: {}, create: { name: 'Demo Org', externalId: 'demo-org' }
      })
      await this.prisma.repo.create({
        data: { orgId: org.id, name: 'example', fullName: 'demo/example', defaultBranch: 'main', score: 72 }
      })
    }
  }
}
