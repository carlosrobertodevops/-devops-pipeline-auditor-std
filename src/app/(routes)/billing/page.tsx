'use client'

import React, { useState } from 'react'
import { createCheckout, createPortal } from '@/lib/api'
import { loadStripe } from '@stripe/stripe-js'

const plans = [
  { code: 'BASIC' as const, title: 'Básico', price: 'R$ 49/mês', features: ['3 repositórios', 'scans manuais', 'histórico 7d'] },
  { code: 'PRO' as const,   title: 'Pro',    price: 'R$ 149/mês', features: ['20 repositórios', 'scans agendados', 'histórico 30d'] },
  { code: 'ORG' as const,   title: 'Org',    price: 'R$ 399/mês', features: ['Ilimitado', 'scans contínuos', 'histórico 180d'] },
]

export default function BillingPage() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(code: 'BASIC' | 'PRO' | 'ORG') {
    setMsg(null)
    setLoading(code)
    try {
      const res = await createCheckout(code)

      // 1) Se vier URL direto do backend, redireciona
      if (res?.url) {
        window.location.href = res.url
        return
      }

      // 2) Se vier sessionId, usa Stripe.js
      if (res?.sessionId) {
        const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (!pk) {
          setMsg('Stripe publishable key ausente (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).')
          return
        }
        const stripe = await loadStripe(pk)
        if (!stripe) {
          setMsg('Falha ao inicializar o Stripe.js.')
          return
        }
        const { error } = await stripe.redirectToCheckout({ sessionId: res.sessionId })
        if (error) setMsg(error.message || 'Erro ao redirecionar para o checkout.')
        return
      }

      // 3) Caso o backend não retorne nem url nem sessionId
      setMsg('Resposta inválida do checkout: sem URL e sem sessionId.')
    } catch (e: any) {
      setMsg(String(e?.message || e))
    } finally {
      setLoading(null)
    }
  }

  async function handlePortal() {
    setMsg(null)
    setLoading('portal')
    try {
      const { url } = await createPortal()
      // `url` é string no contrato da API
      window.location.href = url
    } catch (e: any) {
      setMsg(String(e?.message || e))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Planos</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.code} className="card">
              <h3 className="text-base font-bold mb-1">{p.title}</h3>
              <div className="text-sm text-slate-300 mb-2">{p.price}</div>
              <ul className="text-sm text-slate-300 mb-3 list-disc pl-5">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button
                className="btn"
                onClick={() => handleCheckout(p.code)}
                disabled={loading === p.code}
              >
                {loading === p.code ? 'Processando…' : 'Assinar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Gerenciar Assinatura</h2>
        <button className="btn" onClick={handlePortal} disabled={loading === 'portal'}>
          {loading === 'portal' ? 'Abrindo portal…' : 'Abrir Portal do Cliente'}
        </button>
      </div>

      {msg && <p className="text-sm text-slate-300">{msg}</p>}
    </div>
  )
}