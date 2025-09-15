import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './common/prisma.service'
import { HealthController } from './common/health.controller'
import { ReposModule } from './repos/repos.module'
import { FindingsModule } from './findings/findings.module'
import { ScansModule } from './scans/scans.module'
import { WebhooksModule } from './webhooks/webhooks.module'
import { BillingModule } from './billing/billing.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ReposModule, FindingsModule, ScansModule, WebhooksModule, BillingModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
