'use client'

import { useState } from 'react'
import { PlanCode, createCheckout, createPortal } from '@/lib/api'

const plans: { code: PlanCode; title: string; price: string; features: string[] }[] = [
  { code: 'BASIC',       title: 'Básico',     price: 'R$ 49/mês',  features: ['3 repositórios','scans manuais','histórico 7d'] },
  { code: 'PRO',         title: 'Profissional', price: 'R$ 149/mês', features: ['10 repositórios','scans agendados','histórico 30d'] },
  { code: 'ENTERPRISE',  title: 'Enterprise', price: 'R$ 490/mês', features: ['ilimitado','SLA','SSO'] },
]

export default function BillingPage() {
  const [loading, setLoading] = useState<PlanCode | 'PORTAL' | null>(null)
  const [msg, setMsg] = useState<string>('')

  const handleCheckout = async (code: PlanCode) => {
    setLoading(code); setMsg('')
    try {
      const res = await createCheckout(code)
      if (res?.url) {
        window.location.href = res.url
        return
      }
      if (res?.sessionId) {
        const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (!pk) { setMsg('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ausente.'); return }
        // import dinâmico — não exige @stripe/stripe-js no build se não for usado
        const stripeJs: any = await import('@stripe/stripe-js').catch(() => null)
        if (!stripeJs?.loadStripe) { setMsg('Stripe.js não disponível.'); return }
        const stripe = await stripeJs.loadStripe(pk)
        await stripe?.redirectToCheckout({ sessionId: res.sessionId })
        return
      }
      setMsg('Resposta inesperada do checkout.')
    } catch (e: any) {
      setMsg(String(e?.message || e))
    } finally {
      setLoading(null)
    }
  }

  const handlePortal = async () => {
    setLoading('PORTAL'); setMsg('')
    try {
      const { url } = await createPortal()
      window.location.href = url // url é string garantida pelo contrato
    } catch (e: any) {
      setMsg(String(e?.message || e))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100">
        <h2 className="font-semibold text-lg mb-3">Planos</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.code} className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
              <div className="text-xl font-semibold">{p.title}</div>
              <div className="text-2xl my-2">{p.price}</div>
              <ul className="text-sm text-slate-300 list-disc ml-5 mb-3">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button
                disabled={!!loading}
                onClick={() => handleCheckout(p.code)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {loading === p.code ? 'Redirecionando...' : 'Assinar'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            disabled={!!loading}
            onClick={handlePortal}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading === 'PORTAL' ? 'Abrindo Portal...' : 'Abrir Portal do Cliente'}
          </button>
        </div>

        {msg && <div className="mt-3 text-slate-300">{msg}</div>}
      </div>
    </div>
  )
}

// 'use client'

// import React, { useState } from 'react'
// import { createCheckout, createPortal } from '@/lib/api'
// import { loadStripe } from '@stripe/stripe-js'

// const plans = [
//   { code: 'BASIC' as const, title: 'Básico', price: 'R$ 49/mês', features: ['3 repositórios', 'scans manuais', 'histórico 7d'] },
//   { code: 'PRO' as const,   title: 'Pro',    price: 'R$ 149/mês', features: ['20 repositórios', 'scans agendados', 'histórico 30d'] },
//   { code: 'ORG' as const,   title: 'Org',    price: 'R$ 399/mês', features: ['Ilimitado', 'scans contínuos', 'histórico 180d'] },
// ]

// export default function BillingPage() {
//   const [msg, setMsg] = useState<string | null>(null)
//   const [loading, setLoading] = useState<string | null>(null)

//   async function handleCheckout(code: 'BASIC' | 'PRO' | 'ORG') {
//     setMsg(null)
//     setLoading(code)
//     try {
//       const res = await createCheckout(code)

//       // 1) Se vier URL direto do backend, redireciona
//       if (res?.url) {
//         window.location.href = res.url
//         return
//       }

//       // 2) Se vier sessionId, usa Stripe.js
//       if (res?.sessionId) {
//         const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
//         if (!pk) {
//           setMsg('Stripe publishable key ausente (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).')
//           return
//         }
//         const stripe = await loadStripe(pk)
//         if (!stripe) {
//           setMsg('Falha ao inicializar o Stripe.js.')
//           return
//         }
//         const { error } = await stripe.redirectToCheckout({ sessionId: res.sessionId })
//         if (error) setMsg(error.message || 'Erro ao redirecionar para o checkout.')
//         return
//       }

//       // 3) Caso o backend não retorne nem url nem sessionId
//       setMsg('Resposta inválida do checkout: sem URL e sem sessionId.')
//     } catch (e: any) {
//       setMsg(String(e?.message || e))
//     } finally {
//       setLoading(null)
//     }
//   }

//   async function handlePortal() {
//     setMsg(null)
//     setLoading('portal')
//     try {
//       const { url } = await createPortal()
//       // `url` é string no contrato da API
//       window.location.href = url
//     } catch (e: any) {
//       setMsg(String(e?.message || e))
//     } finally {
//       setLoading(null)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="card">
//         <h2 className="text-lg font-semibold mb-4">Planos</h2>
//         <div className="grid sm:grid-cols-3 gap-4">
//           {plans.map((p) => (
//             <div key={p.code} className="card">
//               <h3 className="text-base font-bold mb-1">{p.title}</h3>
//               <div className="text-sm text-slate-300 mb-2">{p.price}</div>
//               <ul className="text-sm text-slate-300 mb-3 list-disc pl-5">
//                 {p.features.map((f) => (
//                   <li key={f}>{f}</li>
//                 ))}
//               </ul>
//               <button
//                 className="btn"
//                 onClick={() => handleCheckout(p.code)}
//                 disabled={loading === p.code}
//               >
//                 {loading === p.code ? 'Processando…' : 'Assinar'}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="card">
//         <h2 className="text-lg font-semibold mb-4">Gerenciar Assinatura</h2>
//         <button className="btn" onClick={handlePortal} disabled={loading === 'portal'}>
//           {loading === 'portal' ? 'Abrindo portal…' : 'Abrir Portal do Cliente'}
//         </button>
//       </div>

//       {msg && <p className="text-sm text-slate-300">{msg}</p>}
//     </div>
//   )
// }