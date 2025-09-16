import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../common/prisma.service'

describe('AuthService (unit)', () => {
  let svc: AuthService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, JwtService, PrismaService]
    }).compile()
    svc = moduleRef.get(AuthService)
    prisma = moduleRef.get(PrismaService)
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('registra e faz login com sucesso', async () => {
    const email = `u_${Date.now()}@test.dev`
    await svc.register({ email, password: '123456', name: 'User' })
    const login = await svc.login({ email, password: '123456' })
    expect(login.accessToken).toBeTruthy()
  })
})