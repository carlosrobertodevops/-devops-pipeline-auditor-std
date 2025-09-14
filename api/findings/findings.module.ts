import { Module } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { FindingsService } from './findings.service'
import { FindingsController } from './findings.controller'

@Module({ controllers:[FindingsController], providers:[PrismaService, FindingsService], exports:[FindingsService] })
export class FindingsModule {}
