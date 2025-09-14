import { Controller, Get } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService){}
  @Get()
  async ok(){
    const now = await this.prisma.$queryRaw`select now()`
    return { status:'ok', db: now }
  }
}
