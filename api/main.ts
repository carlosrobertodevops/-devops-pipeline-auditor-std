import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cors from 'cors'
import * as express from 'express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import YAML from 'yaml'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // CORS (origens separadas por vírgula)
  app.use(cors({ origin: (process.env.FRONTEND_URL || '').split(','), credentials: true }))

  // Stripe webhook precisa do raw body
  app.use('/webhooks/stripe', express.raw({ type: 'application/json' }))

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('DevOps Pipeline Auditor API')
    .setDescription('API para auditoria de pipelines CI/CD (MVP)')
    .setVersion('1.0.0')
    .addTag('health')
    .addTag('repos')
    .addTag('scans')
    .addTag('findings')
    .addTag('billing')
    .addTag('auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // Endpoints para baixar o OpenAPI "vivo"
  const http = app.getHttpAdapter()
  http.get('/openapi.json', (_req: any, res: any) => res.json(document))
  http.get('/openapi.yaml', (_req: any, res: any) => {
    res.type('text/yaml').send(YAML.stringify(document))
  })

  // Opcional: gerar arquivos em disco quando variável setada
  if (process.env.GENERATE_OPENAPI === '1') {
    try {
      writeFileSync('./openapi.json', JSON.stringify(document, null, 2))
      writeFileSync('./openapi.yaml', YAML.stringify(document))
      // eslint-disable-next-line no-console
      console.log('openapi.json e openapi.yaml gerados na pasta api/')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Falha ao gravar openapi.*:', e)
    }
  }

  const port = process.env.PORT || 3001
  await app.listen(port as number)
  // eslint-disable-next-line no-console
  console.log('API listening on', port, '— Swagger UI: /docs  |  OpenAPI: /openapi.json /openapi.yaml')
}
bootstrap()
