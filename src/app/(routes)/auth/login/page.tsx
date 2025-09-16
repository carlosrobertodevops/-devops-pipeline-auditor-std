'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { apiLogin, setToken } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const { access_token } = await apiLogin(email, password)
      setToken(access_token)
      setMsg('Login realizado! Você já pode acessar o Dashboard.')
    } catch (err: any) {
      setMsg(err?.message || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          className="px-3 py-2 rounded bg-white/10 border border-white/10"
          placeholder="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="px-3 py-2 rounded bg-white/10 border border-white/10"
          placeholder="senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm text-slate-300">{msg}</p>}

      <div className="mt-4 text-sm">
        <Link className="nav-link" href="/dashboard">
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  )
}