import {
  Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { JwtAuthGuard } from './jwt.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiOkResponse({ description: 'Usuário criado + token JWT' })
  async register(@Body() dto: RegisterDto) {
    const { user, accessToken } = await this.auth.register(dto)
    return { user, accessToken }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login com email/senha' })
  @ApiOkResponse({ description: 'Retorna token JWT + dados do usuário' })
  async login(@Body() dto: LoginDto) {
    const { user, accessToken } = await this.auth.login(dto)
    return { user, accessToken }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil autenticado' })
  async me(@Req() req: any) {
    return this.auth.getProfile(req.user.sub)
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar perfil (ex.: nome, senha)' })
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(req.user.sub, dto)
  }
}
