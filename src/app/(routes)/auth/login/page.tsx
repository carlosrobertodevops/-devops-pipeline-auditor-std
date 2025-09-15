'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { apiLogin, setToken } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { accessToken } = await apiLogin(email, password)
      setToken(accessToken)
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err?.message || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app">
      <div className="card max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Entrar</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">E-mail</label>
            <input
              type="email"
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button disabled={loading} className="btn w-full justify-center">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm mt-4 text-slate-300">
          Ainda não tem conta?{' '}
          <Link href="/billing/subscription" className="nav-link">Assine</Link>
        </p>
      </div>
    </div>
  )
}
