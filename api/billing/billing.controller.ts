
import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common'
import { BillingService } from './billing.service'
import { PrismaService } from '../common/prisma.service'
import type { Request } from 'express'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { PLAN_LIMITS } from './plan.utils'

@ApiTags('billing')
@Controller()
export class BillingController {
  constructor(private billing: BillingService, private prisma: PrismaService){}

  private async getDemoOrg(){
    const org = await this.prisma.org.upsert({
      where: { externalId: 'demo-org' },
      update: {},
      create: { name: 'Demo Org', externalId: 'demo-org' }
    })
    return org
  }

  @Get('billing/me')
  @ApiOperation({ summary: 'Retorna status da assinatura da organização' })
  @ApiOkResponse({ description: 'Plano e limites atuais' })
  async me(){
    const org = await this.getDemoOrg()
    const limits = PLAN_LIMITS[org.plan]
    const repoCount = await this.prisma.repo.count({ where: { orgId: org.id } })
    return {
      id: org.id,
      name: org.name,
      plan: org.plan,
      planStatus: org.planStatus,
      currentPeriodEnd: org.currentPeriodEnd,
      limits,
      usage: { repoCount }
    }
  }

  @Post('billing/checkout')
  @ApiOperation({ summary: 'Cria sessão de checkout (Stripe) para assinar um plano' })
  @ApiOkResponse({ description: 'URL de checkout' })
  async checkout(@Body() body: { plan: 'BASIC'|'PRO'|'ENTERPRISE', successUrl?: string, cancelUrl?: string }){
    const org = await this.getDemoOrg()
    const firstFrontend = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0]
    const success = body.successUrl || `${firstFrontend}/billing?success=1`
    const cancel  = body.cancelUrl  || `${firstFrontend}/billing?canceled=1`
    return this.billing.createCheckout(org.id, body.plan, success, cancel)
  }

  @Post('billing/portal')
  @ApiOperation({ summary: 'Cria sessão do Customer Portal (Stripe)' })
  @ApiOkResponse({ description: 'URL do portal' })
  async portal(@Body() body: { returnUrl?: string }){
    const org = await this.getDemoOrg()
    const firstFrontend = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',')[0]
    const ret = body.returnUrl || `${firstFrontend}/billing`
    return this.billing.createPortal(org.id, ret)
  }

  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Webhook do Stripe' })
  async webhook(@Req() req: Request, @Headers('stripe-signature') signature?: string){
    const raw = (req as any).body as Buffer
    return this.billing.handleWebhook(signature, raw)
  }
}
