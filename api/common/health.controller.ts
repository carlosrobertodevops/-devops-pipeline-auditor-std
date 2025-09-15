import { Controller, Get } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService){}
  @Get()
  @ApiOperation({ summary: 'Status da API e conexão com o banco' })
  @ApiOkResponse({ description: 'Retorna status ok e timestamp do DB' })
  async ok(){
    const now = await this.prisma.$queryRaw`select now()`
    return { status:'ok', db: now }
  }
}
