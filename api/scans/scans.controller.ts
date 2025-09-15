import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { ScansService } from './scans.service'
import { PlanGuard } from '../billing/plan.guard'
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger'

@ApiTags('scans')
@Controller('scans')
export class ScansController {
  constructor(private service: ScansService){}

  @Post(':repoId')
  @UseGuards(PlanGuard)
  @ApiOperation({ summary: 'Dispara um scan demo no repositório' })
  @ApiOkResponse({ description: 'Scan criado' })
  @ApiParam({ name: 'repoId' })
  trigger(@Param('repoId') repoId: string){
    return this.service.trigger(repoId)
  }
}
