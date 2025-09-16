'use client'

import React, { useEffect, useState } from 'react'
import { apiMe, apiUpdateProfile, clearToken } from '@/lib/api'
import Link from 'next/link'

export default function ProfilePage() {
  const [me, setMe] = useState<{ id: string; email: string; name?: string | null } | null>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let alive = true
    apiMe()
      .then((u) => {
        if (alive) {
          setMe(u)
          setName(u.name || '')
        }
      })
      .catch((e) => setMsg(e?.message || 'Falha ao carregar perfil'))
    return () => {
      alive = false
    }
  }, [])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      await apiUpdateProfile({ name, password: password || undefined })
      setMsg('Perfil atualizado!')
      setPassword('')
    } catch (err: any) {
      setMsg(err?.message || 'Erro ao atualizar')
    } finally {
      setLoading(false)
    }
  }

  function onLogout() {
    clearToken()
    setMe(null)
    setMsg('Sessão encerrada.')
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Perfil</h2>

      {!me ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Você não está autenticado.</p>
          <Link className="btn" href="/auth/login">Ir para o login</Link>
        </div>
      ) : (
        <form onSubmit={onSave} className="flex flex-col gap-3">
          <div className="text-sm text-slate-300">Email: {me.email}</div>
          <input
            className="px-3 py-2 rounded bg-white/10 border border-white/10"
            placeholder="nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="px-3 py-2 rounded bg-white/10 border border-white/10"
            placeholder="nova senha (opcional)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button className="btn" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="badge" onClick={onLogout}>
              Logout
            </button>
          </div>
        </form>
      )}

      {msg && <p className="mt-3 text-sm text-slate-300">{msg}</p>}
    </div>
  )
}