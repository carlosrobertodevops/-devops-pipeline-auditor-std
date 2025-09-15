'use client'

import React, { useEffect, useState } from 'react'
import { getRepos, createRepo, triggerScan } from '@/lib/api'

type Repo = {
  id: string
  name: string
  url?: string | null
  provider?: 'github' | 'gitlab' | 'bitbucket' | 'other' | null
  createdAt?: string | null
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  // form create
  const [newName, setNewName] = useState<string>('')
  const [newUrl, setNewUrl] = useState<string>('')
  const [newProvider, setNewProvider] =
    useState<'github' | 'gitlab' | 'bitbucket' | 'other'>('github')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRepos()
      setRepos(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar repositórios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMsg(null)
    const name = newName.trim()
    if (!name) {
      setError('Informe um nome para o repositório')
      return
    }
    try {
      setMsg('Criando repositório...')
      await createRepo({
        name,
        url: newUrl.trim() || undefined,
        provider: newProvider || 'github',
      })
      setNewName('')
      setNewUrl('')
      setNewProvider('github')
      setMsg('Repositório criado!')
      await load()
    } catch (e: any) {
      setError(e?.message || 'Erro ao criar repositório')
    } finally {
      setTimeout(() => setMsg(null), 2000)
    }
  }

  const onTriggerScan = async (repoId: string) => {
    setError(null)
    setMsg(null)
    try {
      setMsg('Disparando scan...')
      await triggerScan(repoId)
      setMsg('Scan disparado com sucesso!')
    } catch (e: any) {
      setError(e?.message || 'Erro ao disparar scan')
    } finally {
      setTimeout(() => setMsg(null), 2000)
    }
  }

  return (
    <div className="container-app">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold m-0">Repositórios</h2>
        <a href="/dashboard" className="nav-link">Voltar ao Dashboard</a>
      </div>

      {/* Formulário de criação */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Novo repositório</h3>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Nome *</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ex.: api-gateway"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">URL (opcional)</label>
            <input
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://github.com/org/repo"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Provider</label>
            <select
              className="w-full rounded-lg bg-slate-900 border border-white/10 p-2"
              value={newProvider}
              onChange={(e) =>
                setNewProvider(e.target.value as 'github' | 'gitlab' | 'bitbucket' | 'other')
              }
            >
              <option value="github">GitHub</option>
              <option value="gitlab">GitLab</option>
              <option value="bitbucket">Bitbucket</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <button className="btn" type="submit">Criar</button>
          </div>
        </form>
      </div>

      {/* Mensagens */}
      {msg && <p className="text-emerald-400 text-sm mb-3">{msg}</p>}
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {/* Lista de repositórios */}
      <div className="card">
        {loading ? (
          <p className="text-slate-300">Carregando…</p>
        ) : repos.length === 0 ? (
          <p className="text-slate-300">Nenhum repositório cadastrado.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="th">Nome</th>
                <th className="th">Provider</th>
                <th className="th">URL</th>
                <th className="th">Criado em</th>
                <th className="th">Ações</th>
              </tr>
            </thead>
            <tbody>
              {repos.map((r) => (
                <tr key={r.id}>
                  <td className="td font-medium">{r.name}</td>
                  <td className="td">{r.provider || '-'}</td>
                  <td className="td">
                    {r.url ? (
                      <a className="nav-link" target="_blank" rel="noreferrer" href={r.url}>
                        abrir
                      </a>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="td">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}
                  </td>
                  <td className="td">
                    <button className="btn" onClick={() => onTriggerScan(r.id)}>
                      Disparar scan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
