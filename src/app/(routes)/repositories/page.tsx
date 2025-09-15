'use client'
import { useEffect, useState } from 'react'
import { getRepos, triggerScan, createRepo } from '@/lib/api'

type Repo = { id: string; name: string; fullName: string; defaultBranch: string; score?: number }

export default function Repositories(){
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoad] = useState(true)
  const [msg, setMsg] = useState('')
  const [newName, setNewName] = useState('')

  const refresh = ()=>{
    setLoad(true)
    getRepos().then(setRepos).catch(e=>setMsg(String(e))).finally(()=>setLoad(false))
  }

  useEffect(refresh, [])

  const onScan = async(id: string)=>{
    setMsg('Disparando scan...')
    try{ await triggerScan(id); setMsg('Scan disparado! Atualize em alguns minutos.') }
    catch(e:any){ setMsg(String(e)) }
  }

  const onCreate = async()=>{
    setMsg('Criando repositório...')
    try{
      await createRepo(newName || undefined)
      setNewName('')
      setMsg('Repositório criado!')
      refresh()
    }catch(e:any){
      setMsg(String(e))
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-xs text-slate-400 mb-1">fullName (org/name)</label>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="demo/repo-xyz" className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none" />
        </div>
        <button className="btn" onClick={onCreate}>Adicionar</button>
      </div>

      <h2 className="text-lg font-semibold">Repositórios</h2>
      {loading ? 'Carregando...' : (
        <table className="table">
          <thead>
            <tr>
              <th className="th">Nome</th>
              <th className="th">Branch</th>
              <th className="th">Score</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody>
            {repos.map(r=>(
              <tr key={r.id}>
                <td className="td">{r.fullName}</td>
                <td className="td"><span className="badge">{r.defaultBranch}</span></td>
                <td className="td">{r.score ?? '-'}</td>
                <td className="td"><button className="btn" onClick={()=>onScan(r.id)}>Scan</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="text-slate-400 mt-3">{msg}</p>
    </div>
  )
}
