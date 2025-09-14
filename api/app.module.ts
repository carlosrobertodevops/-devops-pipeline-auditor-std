import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './common/prisma.service'
import { HealthController } from './common/health.controller'
import { ReposModule } from './repos/repos.module'
import { FindingsModule } from './findings/findings.module'
import { ScansModule } from './scans/scans.module'
import { WebhooksModule } from './webhooks/webhooks.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ReposModule, FindingsModule, ScansModule, WebhooksModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
