'use client'

import React, { useState } from 'react'
import { createPortal } from '@/lib/api'

export default function SubscriptionsPage() {
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setMsg(null)
    setLoading(true)
    try {
      const { url } = await createPortal() // `url` é garantido como string no contrato
      window.location.href = url
    } catch (e: any) {
      setMsg(String(e?.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Minhas Assinaturas</h2>
      <p className="text-sm text-slate-300 mb-3">
        Gerencie suas formas de pagamento, recibos e plano no portal do cliente.
      </p>
      <button className="btn" onClick={openPortal} disabled={loading}>
        {loading ? 'Abrindo…' : 'Abrir Portal do Cliente'}
      </button>
      {msg && <p className="mt-3 text-sm text-slate-300">{msg}</p>}
    </div>
  )
}