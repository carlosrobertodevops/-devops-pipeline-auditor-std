'use client'
import { useState } from 'react'
import { createCheckout, createPortal } from '@/lib/api'

const plans = [
  { code:'BASIC' as const,       title:'Básico',      price:'R$ 49/mês',   features:['3 repositórios','scans manuais','histórico 7d'] },
  { code:'PRO' as const,         title:'Profissional',price:'R$ 199/mês',  features:['50 repositórios','scans agendados','webhook','histórico 90d'] },
  { code:'ENTERPRISE' as const,  title:'Enterprise',  price:'Fale com vendas', features:['Ilimitado','SSO/SCIM (roadmap)','suporte prioritário'] },
]

export default function BillingPage(){
  const [msg, setMsg] = useState('')

  const goCheckout = async(code: 'BASIC'|'PRO'|'ENTERPRISE')=>{
    setMsg('Criando sessão de checkout...')
    try{
      const { url } = await createCheckout(code)
      window.location.href = url
    }catch(e:any){
      setMsg(String(e))
    }
  }

  const openPortal = async()=>{
    setMsg('Abrindo portal do cliente...')
    try{
      const { url } = await createPortal()
      window.location.href = url
    }catch(e:any){
      setMsg(String(e))
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Planos</h2>
        <p className="text-slate-300 mb-4">Escolha o plano que faz sentido para seu time.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(p=>(
            <div key={p.code} className="card">
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="text-slate-300 mb-2">{p.price}</p>
              <ul className="text-sm text-slate-300 mb-3 list-disc list-inside">
                {p.features.map(f=><li key={f}>{f}</li>)}
              </ul>
              <button className="btn" onClick={()=>goCheckout(p.code)}>
                Assinar {p.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-base font-semibold mb-2">Já é cliente?</h3>
        <p className="text-slate-300 mb-3">Acesse o portal para trocar plano, atualizar cartão e obter notas fiscais.</p>
        <button className="btn" onClick={openPortal}>Abrir Portal do Cliente</button>
      </div>

      {msg && <p className="text-slate-400">{msg}</p>}
    </div>
  )
}
