import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from '../common/prisma.service'
import { BillingService } from './billing.service'
import { BillingController } from './billing.controller'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BillingController],
  providers: [PrismaService, BillingService],
  exports: [BillingService],
})
export class BillingModule {}
