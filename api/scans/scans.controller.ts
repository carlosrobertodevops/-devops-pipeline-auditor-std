import { Controller, Param, Post } from '@nestjs/common'
import { ScansService } from './scans.service'

@Controller('scans')
export class ScansController {
  constructor(private service: ScansService){}
  @Post(':repoId')
  trigger(@Param('repoId') repoId: string){
    return this.service.trigger(repoId)
  }
}
