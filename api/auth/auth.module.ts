import { Module } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [PrismaService],
  exports: []
})
export class AuthModule {}
