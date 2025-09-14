'use client'
import { useEffect, useState } from 'react'
import { getRepos, triggerScan } from '@/lib/api'

type Repo = { id: string; name: string; fullName: string; defaultBranch: string; score?: number }

export default function Repositories(){
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoad] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    getRepos().then(setRepos).catch(e=>setMsg(String(e))).finally(()=>setLoad(false))
  },[])

  const onScan = async(id: string)=>{
    setMsg('Disparando scan...')
    try{ await triggerScan(id); setMsg('Scan disparado! Atualize em alguns minutos.') }
    catch(e:any){ setMsg(String(e)) }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Repositórios</h2>
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
