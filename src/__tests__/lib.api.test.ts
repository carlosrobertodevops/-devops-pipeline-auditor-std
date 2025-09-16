import { getHealth } from '../lib/api'

describe('lib/api – getHealth', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, version: '1.0.0' })
    }) as any
  })

  it('retorna status ok do backend', async () => {
    const data = await getHealth()
    expect(data.ok).toBe(true)
  })
})