import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { PLAN_LIMITS } from './plan.utils'
import type { Request } from 'express'

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const key = (req.headers['x-api-key'] as string|undefined) || undefined

    let org = key ? await this.prisma.org.findFirst({ where: { apiKey: key } }) : null
    if (!org) org = await this.prisma.org.findUnique({ where: { externalId: 'demo-org' } })
    if (!org) return true

    const limits = PLAN_LIMITS[org.plan]
    if (limits.maxRepos == null) return true
    const repoCount = await this.prisma.repo.count({ where: { orgId: org.id } })
    if (repoCount > limits.maxRepos) {
      throw new ForbiddenException(`Seu plano (${org.plan}) permite até ${limits.maxRepos} repositório(s).`)
    }
    return true
  }
}

@Injectable()
export class PlanCreateRepoGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const key = (req.headers['x-api-key'] as string|undefined) || undefined

    let org = key ? await this.prisma.org.findFirst({ where: { apiKey: key } }) : null
    if (!org) org = await this.prisma.org.findUnique({ where: { externalId: 'demo-org' } })
    if (!org) return true

    const limits = PLAN_LIMITS[org.plan]
    if (limits.maxRepos == null) return true
    const repoCount = await this.prisma.repo.count({ where: { orgId: org.id } })
    if (repoCount >= limits.maxRepos) {
      throw new ForbiddenException(`Limite de repositórios atingido no plano ${org.plan} (máx: ${limits.maxRepos}). Faça upgrade para adicionar mais.`)
    }
    return true
  }
}
