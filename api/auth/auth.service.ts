import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../common/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  private pickUser(u: any) {
    if (!u) return null
    const { passwordHash, ...rest } = u
    return rest
  }

  private sign(user: any) {
    return this.jwt.sign({ sub: user.id, email: user.email })
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new BadRequestException('E-mail já cadastrado')

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name || null,
        passwordHash,
        plan: 'BASIC',
        planStatus: 'inactive',
        currentPeriodEnd: null
      }
    })

    const accessToken = this.sign(user)
    return { user: this.pickUser(user), accessToken }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Credenciais inválidas')

    const ok = await bcrypt.compare(dto.password, user.passwordHash || '')
    if (!ok) throw new UnauthorizedException('Credenciais inválidas')

    const accessToken = this.sign(user)
    return { user: this.pickUser(user), accessToken }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return this.pickUser(user)
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updates: any = {}
    if (dto.name !== undefined) updates.name = dto.name
    if (dto.password) {
      if (dto.password.length < 6) throw new BadRequestException('Senha muito curta')
      updates.passwordHash = await bcrypt.hash(dto.password, 10)
    }
    const user = await this.prisma.user.update({ where: { id: userId }, data: updates })
    return this.pickUser(user)
  }
}
