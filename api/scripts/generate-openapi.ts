import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { writeFileSync } from 'fs'

async function gen(){
  const app = await NestFactory.create(AppModule, { logger: false })
  const config = new DocumentBuilder()
    .setTitle('DevOps Pipeline Auditor API')
    .setDescription('API para auditoria de pipelines CI/CD (MVP)')
    .setVersion('1.0.0')
    .build()
  const doc = SwaggerModule.createDocument(app, config)
  writeFileSync('./openapi.json', JSON.stringify(doc, null, 2))
  await app.close()
  console.log('openapi.json gerado em api/openapi.json')
}
gen()
