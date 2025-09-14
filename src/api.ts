const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

async function api(path: string, init?: RequestInit){
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store', ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const getHealth   = () => api('/health');
export const getRepos    = () => api('/repos');
export const getFindings = (repoId?: string) => api('/findings' + (repoId ? `?repoId=${repoId}` : ''));
export const triggerScan = (repoId: string) => api(`/scans/${repoId}`, { method: 'POST' });
