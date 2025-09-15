import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { PrismaInstrumentation } from '@prisma/instrumentation'

const prometheusPort = Number(process.env.OTEL_PROMETHEUS_PORT ?? 9464)
const prometheusEndpoint = process.env.OTEL_PROMETHEUS_ENDPOINT ?? '/metrics'

const prometheusExporter = new PrometheusExporter({
  port: prometheusPort,
  endpoint: prometheusEndpoint,
})

export const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'dpa-api',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  metricReader: prometheusExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
    new PrismaInstrumentation(),
  ],
})

;(async () => {
  try {
    await sdk.start()
    // eslint-disable-next-line no-console
    console.log(`✅ OpenTelemetry Prometheus endpoint on http://0.0.0.0:${prometheusPort}${prometheusEndpoint}`)
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error('OpenTelemetry SDK start error', err)
  }
})()

process.once('SIGTERM', () => {
  sdk.shutdown().finally(() => process.exit(0))
})
process.once('SIGINT', () => {
  sdk.shutdown().finally(() => process.exit(0))
})
