// src/lib/api.ts

export const BASE_URL = (() => {
  const env = process.env.NEXT_PUBLIC_API_URL
  if (env && env.trim().length > 0) return env.trim()
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:3001`
  }
  return 'http://localhost:3001'
})()

const TOKEN_KEY = 'dpa_token'

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export const setToken = (t: string) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(TOKEN_KEY, t) } catch {}
}
export const clearToken = () => {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(TOKEN_KEY) } catch {}
}

type FetchOpts = RequestInit & { auth?: boolean }
async function fetchJson<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  }
  if (opts.auth) {
    const tk = getToken()
    if (tk) headers.Authorization = `Bearer ${tk}`
  }
  const res = await fetch(url, { ...opts, headers })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

/** --------- Tipos --------- */
export type PlanCode = 'BASIC' | 'PRO' | 'ENTERPRISE'

export type RepoProvider = 'github' | 'gitlab' | 'bitbucket'
export type Repo = {
  id: string
  name: string
  provider: RepoProvider
  url?: string
  createdAt?: string
}

export type CreateRepoInput = {
  name: string
  provider: RepoProvider
}

export type Finding = {
  id: string
  repoId: string
  rule: string
  severity: 'low' | 'medium' | 'high'
  createdAt: string
  file?: string
  line?: number
}

/** --------- Health --------- */
export async function getHealth(): Promise<any> {
  return fetchJson('/health')
}

/** --------- Auth --------- */
export async function apiLogin(input: { email: string; password: string }): Promise<{ token: string }> {
  return fetchJson('/auth/login', { method: 'POST', body: JSON.stringify(input) })
}
export async function apiMe(): Promise<{ id: string; email: string; name?: string; plan?: string }> {
  return fetchJson('/auth/me', { auth: true })
}
export async function apiUpdateProfile(input: { name?: string; password?: string }): Promise<{ id: string; email: string; name?: string }> {
  return fetchJson('/auth/profile', { method: 'PATCH', body: JSON.stringify(input), auth: true })
}

/** --------- Billing (Stripe) --------- */
export async function createCheckout(plan: PlanCode): Promise<{ url?: string; sessionId?: string }> {
  return fetchJson('/billing/checkout', { method: 'POST', body: JSON.stringify({ plan }), auth: true })
}
export async function createPortal(): Promise<{ url: string }> {
  return fetchJson('/billing/portal', { method: 'POST', auth: true })
}

/** --------- Repos --------- */
export async function getRepos(): Promise<Repo[]> {
  return fetchJson('/repos', { auth: true })
}
export async function createRepo(input: CreateRepoInput): Promise<Repo> {
  return fetchJson('/repos', { method: 'POST', body: JSON.stringify(input), auth: true })
}
export async function triggerScan(repoId: string): Promise<{ status: string }> {
  return fetchJson(`/scans/${encodeURIComponent(repoId)}`, { method: 'POST', auth: true })
}

/** --------- Findings --------- */
export async function getFindings(): Promise<Finding[]> {
  return fetchJson('/findings', { auth: true })
}

// debug
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[api] BASE_URL =', BASE_URL)
}