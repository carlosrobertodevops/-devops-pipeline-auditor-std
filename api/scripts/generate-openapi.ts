import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import YAML from 'yaml'

async function gen(){
  const app = await NestFactory.create(AppModule, { logger: false })

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

  const doc = SwaggerModule.createDocument(app, config)

  writeFileSync('./openapi.json', JSON.stringify(doc, null, 2))
  writeFileSync('./openapi.yaml', YAML.stringify(doc))

  await app.close()
  // eslint-disable-next-line no-console
  console.log('✔ OpenAPI exportado: api/openapi.json e api/openapi.yaml')
}
gen()
