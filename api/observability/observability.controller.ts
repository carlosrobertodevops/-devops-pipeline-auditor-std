import { Controller, Get, Res } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'

@ApiTags('observability')
@Controller('observability')
export class ObservabilityController {
  @Get('info')
  @ApiOkResponse({
    description: 'Informações do endpoint Prometheus/OTel exposto pela API',
    schema: {
      type: 'object',
      properties: {
        service: { type: 'string', example: 'dpa-api' },
        prometheusExporter: {
          type: 'object',
          properties: {
            port: { type: 'integer', example: 9464 },
            endpoint: { type: 'string', example: '/metrics' },
            url: { type: 'string', example: 'http://localhost:9464/metrics' }
          }
        }
      }
    }
  })
  info() {
    const port = Number(process.env.OTEL_PROMETHEUS_PORT || 9464)
    const endpoint = process.env.OTEL_PROMETHEUS_ENDPOINT || '/metrics'
    const host = process.env.PROMETHEUS_EXPORTER_HOST || 'localhost'
    return {
      service: 'dpa-api',
      prometheusExporter: {
        port,
        endpoint,
        url: `http://${host}:${port}${endpoint}`,
      },
    }
  }

  @Get('metrics')
  @ApiResponse({ status: 302, description: 'Redireciona para o endpoint real de métricas do Prometheus Exporter' })
  metrics(@Res() res: Response) {
    const port = Number(process.env.OTEL_PROMETHEUS_PORT || 9464)
    const endpoint = process.env.OTEL_PROMETHEUS_ENDPOINT || '/metrics'
    const host = process.env.PROMETHEUS_EXPORTER_HOST || 'localhost'
    const target = `http://${host}:${port}${endpoint}`
    return res.redirect(302, target)
  }
}
