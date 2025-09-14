import { Controller, Get, Query } from '@nestjs/common'
import { FindingsService } from './findings.service'

@Controller('findings')
export class FindingsController {
  constructor(private service: FindingsService){}
  @Get()
  list(@Query('repoId') repoId?: string){
    return this.service.list(repoId)
  }
}
