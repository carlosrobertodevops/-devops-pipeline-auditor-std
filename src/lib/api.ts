// src/lib/api.ts
// Camada única de chamadas ao backend (NestJS).
// - SSR usa INTERNAL_API_URL (ex.: http://api:3001)
// - Browser usa NEXT_PUBLIC_API_URL (ex.: http://localhost:3001)
// - JWT armazenado em localStorage (somente client)

type Json = Record<string, any> | Array<any> | null;

const TOKEN_KEY = 'dpa:token';
const isServer = typeof window === 'undefined';

function getBaseUrl(): string {
  if (isServer) {
    return (
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://api:3001'
    );
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

// ---------------- Token helpers (client only) ----------------
export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}
export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// ---------------- HTTP core ----------------
async function request<T = any>(
  path: string,
  init: RequestInit & { json?: Json } = {},
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path}`;

  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && init.json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  // Injeta Authorization somente no client
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const body =
    init.json !== undefined ? JSON.stringify(init.json) : (init.body as any);

  const res = await fetch(url, {
    ...init,
    headers,
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText);
  }

  if (res.status === 204) return null as T;

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

// ============================ AUTH ============================
export async function apiLogin(email: string, password: string): Promise<{
  access_token: string;
}> {
  return request('/auth/login', {
    method: 'POST',
    json: { email, password },
  });
}

export async function apiMe(): Promise<{
  id: string;
  email: string;
  name?: string | null;
}> {
  return request('/auth/me', { method: 'GET' });
}

export async function apiUpdateProfile(payload: {
  name?: string;
  password?: string;
}): Promise<{ success: true }> {
  return request('/auth/profile', { method: 'PATCH', json: payload });
}

// =========================== BILLING ==========================
export async function createCheckout(planCode: string): Promise<{
  url?: string;
  sessionId?: string;
}> {
  return request('/billing/checkout', { method: 'POST', json: { planCode } });
}

export async function createPortal(): Promise<{ url: string }> {
  return request('/billing/portal', { method: 'POST' });
}

// =========================== HEALTH ===========================
export async function getHealth(): Promise<{ status: string }> {
  return request('/health', { method: 'GET' });
}

// ============================ REPOS ===========================
export type CreateRepoInput = { name: string } | string;
function normalizeRepoInput(input: CreateRepoInput): { name: string } {
  return typeof input === 'string' ? { name: input } : input;
}
export async function getRepos(): Promise<
  Array<{ id: string; name: string; createdAt: string }>
> {
  return request('/repos', { method: 'GET' });
}
export async function createRepo(input: CreateRepoInput): Promise<{
  id: string;
  name: string;
}> {
  return request('/repos', { method: 'POST', json: normalizeRepoInput(input) });
}
export async function triggerScan(repoId: string): Promise<{ ok: true }> {
  return request(`/scans/${encodeURIComponent(repoId)}`, { method: 'POST' });
}

// =========================== FINDINGS =========================
export async function getFindings(): Promise<
  Array<{
    id: string;
    repoId: string;
    rule: string;
    severity: 'low' | 'medium' | 'high';
    createdAt: string;
  }>
> {
  return request('/findings', { method: 'GET' });
}