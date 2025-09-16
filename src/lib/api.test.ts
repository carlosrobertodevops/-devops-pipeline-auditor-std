// src/lib/api.test.ts
import { BASE_URL } from './api'

describe('BASE_URL resolution', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })
  afterAll(() => {
    process.env = OLD_ENV
  })

  it('usa NEXT_PUBLIC_API_URL quando definido', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3999'
    const mod = await import('./api')
    expect(mod.BASE_URL).toBe('http://localhost:3999')
  })

  it('faz fallback para http://<host>:3001 no browser', async () => {
    // simula window no ambiente de teste
    ;(global as any).window = { location: { protocol: 'http:', hostname: '127.0.0.1' } }
    // limpar cache do módulo para recalcular BASE_URL
    jest.isolateModules(async () => {
      const mod = await import('./api')
      expect(mod.BASE_URL).toBe('http://127.0.0.1:3001')
    })
  })
})