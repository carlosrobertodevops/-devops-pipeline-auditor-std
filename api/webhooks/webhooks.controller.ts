import { Body, Controller, Headers, Post } from '@nestjs/common'
@Controller('webhooks')
export class WebhooksController {
  @Post('github')
  async github(@Headers() headers: Record<string, string>, @Body() payload: any) {
    // TODO: validar X-Hub-Signature-256 com segredo do App (se aplicar)
    return {
      ok: true,
      event: headers['x-github-event'] || null,
      ping: payload?.zen || null,
    }
  }
}
