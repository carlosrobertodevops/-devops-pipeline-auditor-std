import { Module } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { ScansService } from './scans.service'
import { ScansController } from './scans.controller'
import { FindingsService } from '../findings/findings.service'
import { PlanGuard } from '../billing/plan.guard'

@Module({ controllers:[ScansController], providers:[PrismaService, ScansService, FindingsService, PlanGuard] })
export class ScansModule {}
