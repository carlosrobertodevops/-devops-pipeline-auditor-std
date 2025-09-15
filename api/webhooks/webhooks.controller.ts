import { Body, Controller, Headers, Post } from '@nestjs/common'

@Controller('webhooks')
export class WebhooksController {
  @Post('github')
  async github(@Headers() h: Record<string,string>, @Body() p: any){
    // TODO: validar X-Hub-Signature-256 com segredo do App
    return { ok: true, event: h['x-github-event'] || null, ping: p?.zen || null }
  }
}
