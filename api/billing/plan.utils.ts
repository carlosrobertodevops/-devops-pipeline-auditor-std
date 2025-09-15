
export const PLAN_LIMITS: Record<'FREE'|'BASIC'|'PRO'|'ENTERPRISE', { maxRepos: number | null }> = {
  FREE: { maxRepos: 1 },
  BASIC: { maxRepos: 3 },
  PRO: { maxRepos: 50 },
  ENTERPRISE: { maxRepos: null }, // ilimitado
}
