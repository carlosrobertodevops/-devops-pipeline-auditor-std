/* eslint-disable @typescript-eslint/no-explicit-any */

// URL pública da API (definida no docker-compose/local .env)
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

// ===== Auth storage (token no localStorage) =====
let _cachedToken: string | null = null;

export function setToken(t: string) {
  _cachedToken = t;
  if (typeof window !== 'undefined') localStorage.setItem('dpa_token', t);
}

export function getToken(): string | null {
  if (_cachedToken) return _cachedToken;
  if (typeof window !== 'undefined') {
    _cachedToken = localStorage.getItem('dpa_token');
  }
  return _cachedToken;
}

export function clearToken() {
  _cachedToken = null;
  if (typeof window !== 'undefined') localStorage.removeItem('dpa_token');
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  const t = getToken();
  return {
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(extra || {}),
  };
}

async function api<T = any>(
  path: string,
  init?: RequestInit & { raw?: boolean }
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: authHeaders({
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status} on ${path}`);
  }
  // algumas rotas (ex: webhooks) não retornam JSON
  if (init?.raw) return (undefined as unknown) as T;
  return (await res.json()) as T;
}

// =================== Tipos ===================
export type Repo = {
  id: string;
  name: string;
  createdAt: string;
};

export type Finding = {
  id: string;
  repoId: string;
  rule: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  // Alguns backends não mandam estes dois — então deixamos opcionais
  file?: string;
  line?: number;
};

export type CreateRepoInput = { name: string };

// =================== Health ===================
export async function getHealth(): Promise<{ status: 'ok' }> {
  return api('/health');
}

// =================== Repos ===================
export async function getRepos(): Promise<Repo[]> {
  return api('/repos');
}

export async function createRepo(input: CreateRepoInput | string): Promise<Repo> {
  const body =
    typeof input === 'string' ? { name: input } : { name: input.name };
  return api('/repos', { method: 'POST', body: JSON.stringify(body) });
}

export async function triggerScan(repoId: string): Promise<{ ok: boolean }> {
  return api(`/scans/${encodeURIComponent(repoId)}`, { method: 'POST' });
}

// =================== Findings ===================
export async function getFindings(): Promise<Finding[]> {
  // O backend pode não enviar file/line; normalizamos aqui
  const items = await api<Array<Partial<Finding> & { id: string }>>('/findings');
  return items.map((f) => ({
    id: f.id,
    repoId: f.repoId!,
    rule: f.rule!,
    severity: (f.severity as Finding['severity']) || 'low',
    createdAt: f.createdAt || new Date().toISOString(),
    file: f.file, // pode vir undefined
    line: typeof f.line === 'number' ? f.line : undefined,
  }));
}

// =================== Billing (Stripe) ===================
export async function createCheckout(
  planCode: 'BASIC' | 'PRO' | 'ENTERPRISE'
): Promise<{ url?: string }> {
  return api('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan: planCode }),
  });
}

export async function createPortal(): Promise<{ url?: string }> {
  return api('/billing/portal', { method: 'POST' });
}

// =================== Auth ===================
export async function apiLogin(email: string, password: string): Promise<{
  access_token: string;
}> {
  const data = await api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function apiMe(): Promise<{
  id: string;
  email: string;
  name?: string;
}> {
  return api('/auth/me', { method: 'GET' });
}

export async function apiUpdateProfile(payload: {
  name?: string;
  password?: string;
}): Promise<{ ok: boolean }> {
  return api('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}