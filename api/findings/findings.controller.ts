import { Controller, Get, Query } from '@nestjs/common'
import { FindingsService } from './findings.service'
import { ApiTags, ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger'

@ApiTags('findings')
@Controller('findings')
export class FindingsController {
  constructor(private service: FindingsService){}
  @Get()
  @ApiOperation({ summary: 'Lista findings, opcionalmente por repoId' })
  @ApiOkResponse({ description: 'Array de findings' })
  @ApiQuery({ name: 'repoId', required: false })
  list(@Query('repoId') repoId?: string){
    return this.service.list(repoId)
  }
}
