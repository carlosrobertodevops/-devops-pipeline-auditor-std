import { Controller, Get } from '@nestjs/common'
import { ReposService } from './repos.service'

@Controller('repos')
export class ReposController {
  constructor(private service: ReposService){ this.service.ensureSeed() }
  @Get()
  list(){ return this.service.listRepos() }
}
