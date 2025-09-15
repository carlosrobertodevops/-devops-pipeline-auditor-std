const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

async function api(path: string, init?: RequestInit){
  const res = await fetch(`${BASE}${path}`, {
    cache: 'no-store',
    headers: { 'x-api-key': API_KEY, ...(init?.headers || {}) },
    ...init
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const getHealth   = () => api('/health');
export const getRepos    = () => api('/repos');
export const createRepo  = (fullName?: string) => api('/repos', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ fullName }) });
export const getFindings = (repoId?: string) => api('/findings' + (repoId ? `?repoId=${repoId}` : ''));
export const triggerScan = (repoId: string) => api(`/scans/${repoId}`, { method: 'POST' });

export const getSubscription = () => api('/billing/me');

export const createCheckout = (plan: 'BASIC'|'PRO'|'ENTERPRISE') =>
  api('/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      plan,
      successUrl: typeof window !== 'undefined' ? `${window.location.origin}/billing?success=1` : undefined,
      cancelUrl:  typeof window !== 'undefined' ? `${window.location.origin}/billing?canceled=1` : undefined,
    })
  })

export const createPortal = () =>
  api('/billing/portal', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      returnUrl: typeof window !== 'undefined' ? `${window.location.origin}/billing` : undefined
    })
  })
