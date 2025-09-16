import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = mod.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /auth/register -> 201', async () => {
    const email = `john_${Date.now()}@dev.dev`
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: '123456', name: 'John' })
      .expect(201)
    expect(res.body.email).toBe(email)
  })

  it('POST /auth/login -> 200 com token', async () => {
    const email = `mary_${Date.now()}@dev.dev`
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: '654321' })
      .expect(201)

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: '654321' })
      .expect(201)
    expect(res.body.accessToken).toBeTruthy()
  })
})