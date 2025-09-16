'use client'

import { useEffect, useState } from 'react'
import { Repo, RepoProvider, getRepos, createRepo, triggerScan } from '@/lib/api'

export default function RepositoriesPage() {
  const [items, setItems] = useState<Repo[]>([])
  const [err, setErr] = useState<string>()
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [newProvider, setNewProvider] = useState<RepoProvider>('github')
  const [newUrl, setNewUrl] = useState('') // opcional (não enviado p/ API atual)

  const refresh = () => {
    setErr(undefined)
    setLoading(true)
    getRepos()
      .then(setItems)
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { refresh() }, [])

  const onCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    setErr(undefined)
    try {
      // API atual aceita somente { name, provider }
      await createRepo({ name: name.trim(), provider: newProvider })
      setName('')
      setNewUrl('')
      refresh()
    } catch (e: any) {
      setErr(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  const onScan = async (id: string) => {
    setLoading(true)
    setErr(undefined)
    try {
      await triggerScan(id)
      refresh()
    } catch (e: any) {
      setErr(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100">
        <h2 className="font-semibold text-lg mb-3">Novo repositório</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2"
            placeholder="ex.: api-gateway"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2"
            placeholder="https://github.com/org/repo (opcional)"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
          />
          <select
            className="bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2"
            value={newProvider}
            onChange={e => setNewProvider(e.target.value as RepoProvider)}
          >
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
            <option value="bitbucket">Bitbucket</option>
          </select>
        </div>
        <div className="mt-3">
          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
            disabled={loading}
          >
            Criar
          </button>
        </div>
        {err && <div className="mt-3 text-red-400">{err}</div>}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100">
        <h2 className="font-semibold text-lg mb-3">Repositórios</h2>
        {loading && <div>Carregando...</div>}
        {!loading && items.length === 0 && <div className="text-slate-400">Nenhum repositório cadastrado.</div>}
        <ul className="space-y-2">
          {items.map(r => (
            <li key={r.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-slate-400">{r.provider}{r.url ? ` • ${r.url}` : ''}</div>
              </div>
              <button
                onClick={() => onScan(r.id)}
                className="px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Scan
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}