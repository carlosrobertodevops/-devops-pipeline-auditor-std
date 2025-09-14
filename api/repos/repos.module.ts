import { Module } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { ReposController } from './repos.controller'
import { ReposService } from './repos.service'

@Module({ controllers:[ReposController], providers:[PrismaService, ReposService], exports:[ReposService] })
export class ReposModule {}
