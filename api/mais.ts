import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cors({ origin: (process.env.FRONTEND_URL || '').split(','), credentials: true }))
  const port = process.env.PORT || 3001
  await app.listen(port as number)
  console.log('API listening on', port)
}
bootstrap()
