import { Body, Controller, Get, Headers, Post } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import crypto from 'crypto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService){}

  @Get('me')
  @ApiOperation({ summary: 'Dados da organização autenticada por API Key' })
  @ApiOkResponse({ description: 'Retorna org + apiKey' })
  async me(@Headers('x-api-key') apiKey?: string){
    let org = apiKey ? await this.prisma.org.findFirst({ where: { apiKey } }) : null
    if (!org) {
      org = await this.prisma.org.findUnique({ where: { externalId: 'demo-org' } })
    }
    if (!org) throw new Error('Org não encontrada')
    return { id: org.id, externalId: org.externalId, name: org.name, plan: org.plan, apiKey: org.apiKey }
  }

  @Post('rotate')
  @ApiOperation({ summary: 'Gera uma nova API Key para a organização' })
  @ApiOkResponse({ description: 'Retorna a nova apiKey' })
  async rotate(@Headers('x-api-key') apiKey?: string){
    let org = apiKey ? await this.prisma.org.findFirst({ where: { apiKey } }) : null
    if (!org) {
      // para demo, permitir rodar sem apiKey (gira a da demo-org)
      org = await this.prisma.org.findUnique({ where: { externalId: 'demo-org' } })
    }
    if (!org) throw new Error('Org não encontrada')
    const newKey = crypto.randomBytes(24).toString('hex')
    await this.prisma.org.update({ where: { id: org.id }, data: { apiKey: newKey } })
    return { apiKey: newKey }
  }
}
