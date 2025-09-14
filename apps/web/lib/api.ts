const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
async function api(path, init){ const res = await fetch(`${BASE}${path}`, { cache: 'no-store', ...init }); if(!res.ok) throw new Error(await res.text()); return res.json(); }
export const getHealth = () => api('/health'); export const getRepos=()=>api('/repos');
export const getFindings=(repoId)=>api('/findings'+(repoId?`?repoId=${repoId}`:''));
export const triggerScan=(repoId)=>api(`/scans/${repoId}`,{ method:'POST' });
