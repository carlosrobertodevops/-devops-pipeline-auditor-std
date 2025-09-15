'use client'

import React, { useEffect, useState } from 'react'
import { apiMe, apiUpdateProfile, clearToken } from '@/lib/api'

type User = {
  id: string
  email: string
  name?: string | null
  plan?: string | null
  planStatus?: string | null
  currentPeriodEnd?: string | null
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const me = await apiMe()
        setUser(me)
        setName(me?.name || '')
      } catch (e: any) {
        setError('Faça login para ver seu perfil.')
      }
    })()
  }, [])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setOk(null)
    try {
      await apiUpdateProfile({ name, password: password || undefined })
      setOk('Perfil atualizado com sucesso!')
      setPassword('')
      const me = await apiMe()
      setUser(me)
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const logout = () => {
    clearToken()
    window.location.href = '/auth/login'
  }

  return (
    <div className="container-app">
      <div className="card max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold m-0">Meu Perfil</h2>
          <button className="badge" onClick={logout}>Sair</button>
        </div>

        {!user && <p className="text-slate-300">Carregando…</p>}

        {user && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card">
                <div className="text-sm text-slate-300">E-mail</div>
                <div className="font-mono">{user.email}</div>
              </div>
              <div className="card">
                <div className="text-sm text-slate-300">Plano</div>
                <div className="font-mono">{user.plan || 'BASIC'}</div>
                <div className="text-xs text-slate-400">Status: {user.planStatus || 'inactive'}</div>
                {user.currentPeriodEnd && (
                  <div className="text-xs text-slate-400">
                    Renovação: {new Date(user.currentPeriodEnd).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={onSave} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input
                  className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Nova senha (opcional)</label>
                <input
                  type="password"
                  className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Deixe em branco para não alterar"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {ok && <p className="text-emerald-400 text-sm">{ok}</p>}

              <button disabled={saving} className="btn">
                {saving ? 'Salvando…' : 'Salvar alterações'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
