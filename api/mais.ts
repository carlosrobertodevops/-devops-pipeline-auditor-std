
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import * as express from 'express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { writeFileSync } from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS
  app.use(cors({ origin: (process.env.FRONTEND_URL || '').split(','), credentials: true }))

  // Stripe webhook precisa do raw body
  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }))

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle('DevOps Pipeline Auditor API')
    .setDescription('API para auditoria de pipelines CI/CD (MVP)')
    .setVersion('1.0.0')
    .addTag('health')
    .addTag('repos')
    .addTag('scans')
    .addTag('findings')
    .addTag('billing')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  if (process.env.GENERATE_OPENAPI === '1') {
    writeFileSync('./openapi.json', JSON.stringify(document, null, 2))
  }

  const port = process.env.PORT || 3001
  await app.listen(port as number)
  console.log('API listening on', port)
}
bootstrap()
