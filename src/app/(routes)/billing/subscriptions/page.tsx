'use client'
import { useEffect, useState } from 'react'
import { getSubscription, createPortal } from '@/lib/api'

type Sub = { id:string; name:string; plan:'FREE'|'BASIC'|'PRO'|'ENTERPRISE'; planStatus?:string|null; currentPeriodEnd?:string|null; limits:{maxRepos:number|null}; usage:{repoCount:number} }

export default function SubscriptionPage(){
  const [sub, setSub] = useState<Sub|null>(null)
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    getSubscription().then(setSub).catch(e=>setMsg(String(e)))
  }, [])

  const openPortal = async()=>{
    setMsg('Abrindo portal...')
    try{ const { url } = await createPortal(); window.location.href = url }catch(e:any){ setMsg(String(e)) }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Minha assinatura</h2>
      {!sub ? (msg || 'Carregando...') : (
        <div className="space-y-2">
          <p><span className="badge">Plano</span> {sub.plan}</p>
          <p><span className="badge">Status</span> {sub.planStatus ?? '-'}</p>
          <p><span className="badge">Renova em</span> {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleString() : '-'}</p>
          <p><span className="badge">Limite de repositórios</span> {sub.limits.maxRepos ?? 'Ilimitado'} | <span className="badge">Uso</span> {sub.usage.repoCount}</p>
          <button className="btn mt-2" onClick={openPortal}>Gerenciar assinatura</button>
        </div>
      )}
      {msg && <p className="text-slate-400 mt-3">{msg}</p>}
    </div>
  )
}
