import { Module } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { ScansService } from './scans.service'
import { ScansController } from './scans.controller'
import { FindingsService } from '../findings/findings.service'

@Module({ controllers:[ScansController], providers:[PrismaService, ScansService, FindingsService] })
export class ScansModule {}
