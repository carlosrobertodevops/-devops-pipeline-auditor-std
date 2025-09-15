import { Module } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { ReposController } from './repos.controller'
import { ReposService } from './repos.service'
import { PlanCreateRepoGuard } from '../billing/plan.guard'

@Module({ controllers:[ReposController], providers:[PrismaService, ReposService, PlanCreateRepoGuard], exports:[ReposService] })
export class ReposModule {}
