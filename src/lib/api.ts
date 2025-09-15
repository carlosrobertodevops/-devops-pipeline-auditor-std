// src/lib/api.ts
// Helper centralizado para chamadas à API (NestJS) com suporte a JWT e respostas 204.
// Mantém compatibilidade com as telas existentes (billing, dashboard, findings, repositories).

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

/** ====== Token helpers (armazenado em localStorage) ====== */
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('dpa_token')
}
export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem('dpa_token', token)
}
export function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('dpa_token')
}

/** ====== Request genérico ====== */
async function request<T = any>(
  path: string,
  method: HttpMethod,
  body?: any,
  auth: boolean = false
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  if (res.status === 204) {
    // sem conteúdo
    return undefined as unknown as T
  }

  // tenta parsear JSON; se falhar, retorna texto simples
  const raw = await res.text().catch(() => '')
  const parseJSON = () => (raw ? JSON.parse(raw) : (undefined as unknown as T))

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`
    try {
      const data = parseJSON() as any
      errMsg = data?.message || data?.error || errMsg
    } catch {
      if (raw) errMsg = raw
    }
    throw new Error(errMsg)
  }

  try {
    return parseJSON()
  } catch {
    // resposta não JSON (ex.: string ou vazio)
    return raw as unknown as T
  }
}

/** ====== AUTH ====== */
export async function apiLogin(email: string, password: string) {
  return request<{ user: any; accessToken: string }>('/auth/login', 'POST', { email, password })
}
export async function apiRegister(email: string, password: string, name?: string) {
  return request<{ user: any; accessToken: string }>('/auth/register', 'POST', { email, password, name })
}
export async function apiMe() {
  return request<any>('/auth/me', 'GET', undefined, true)
}
export async function apiUpdateProfile(data: { name?: string; password?: string }) {
  return request<any>('/auth/profile', 'PATCH', data, true)
}

/** ====== HEALTH (Dashboard) ====== */
export async function getHealth() {
  // HealthController geralmente expõe GET /health
  return request<{ status: string }>('/health', 'GET')
}

/** ====== REPOS ====== */
export type CreateRepoInput = {
  name: string
  url?: string
  provider?: 'github' | 'gitlab' | 'bitbucket' | 'other'
}
export async function getRepos() {
  return request<any[]>('/repos', 'GET', undefined, true)
}
export async function createRepo(data: CreateRepoInput) {
  return request<any>('/repos', 'POST', data, true)
}

/** ====== SCANS ====== */
export async function triggerScan(repoId: string) {
  // Convencionalmente /scans/:repoId/trigger
  return request<any>(`/scans/${encodeURIComponent(repoId)}/trigger`, 'POST', {}, true)
}

/** ====== FINDINGS ====== */
export async function getFindings(params?: { repoId?: string }) {
  const q = params?.repoId ? `?repoId=${encodeURIComponent(params.repoId)}` : ''
  return request<any[]>(`/findings${q}`, 'GET', undefined, true)
}

/** ====== BILLING / STRIPE ====== */
export type PlanCode = 'BASIC' | 'PRO' | 'ENTERPRISE'

export async function createCheckout(plan: PlanCode) {
  // espera um { url: string } de retorno
  return request<{ url: string }>('/billing/checkout', 'POST', { plan }, true)
}

export async function createPortal() {
  // espera um { url: string } de retorno
  return request<{ url: string }>('/billing/portal', 'POST', {}, true)
}

export async function getSubscriptions() {
  return request<any[]>('/billing/subscriptions', 'GET', undefined, true)
}

/** ====== Observability (opcional no front) ====== */
export async function getObsInfo() {
  return request<{ service: string; prometheusExporter: { port: number; endpoint: string; url: string } }>(
    '/observability/info',
    'GET',
    undefined,
    true
  )
}
