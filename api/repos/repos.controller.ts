
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ReposService } from './repos.service'
import { ApiTags, ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger'
import { PlanCreateRepoGuard } from '../billing/plan.guard'

@ApiTags('repos')
@Controller('repos')
export class ReposController {
  constructor(private service: ReposService){ this.service.ensureSeed() }

  @Get()
  @ApiOperation({ summary: 'Lista repositórios da organização' })
  @ApiOkResponse({ description: 'Array de repositórios' })
  list(){ return this.service.listRepos() }

  @Post()
  @UseGuards(PlanCreateRepoGuard)
  @ApiOperation({ summary: 'Cria um repositório (demo/mocked) para efeitos de limite' })
  @ApiOkResponse({ description: 'Repositório criado' })
  @ApiBody({ schema: { type: 'object', properties: { fullName: { type: 'string' }, defaultBranch: { type: 'string', default: 'main' } } } })
  create(@Body() body: { fullName?: string, defaultBranch?: string }){
    return this.service.createDemo(body?.fullName, body?.defaultBranch || 'main')
  }
}
