'use client'
import { useEffect, useState } from 'react'
import { getFindings } from '@/lib/api'

type Finding = { id:string; rule:string; severity:'LOW'|'MEDIUM'|'HIGH'; file:string; line:number; suggestion?:string; repoId:string }

export default function Findings(){
  const [items, setItems] = useState<Finding[]>([])
  const [loading, setLoad] = useState(true)
  const [err, setErr] = useState('')

  useEffect(()=>{
    getFindings().then(setItems).catch(e=>setErr(String(e))).finally(()=>setLoad(false))
  },[])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Findings</h2>
      {loading ? 'Carregando...' : err ? err : (
        <table className="table">
          <thead>
            <tr>
              <th className="th">Severidade</th>
              <th className="th">Regra</th>
              <th className="th">Arquivo</th>
              <th className="th">Linha</th>
              <th className="th">Sugestão</th>
            </tr>
          </thead>
          <tbody>
            {items.map(f=>(
              <tr key={f.id}>
                <td className="td"><span className="badge">{f.severity}</span></td>
                <td className="td">{f.rule}</td>
                <td className="td">{f.file}</td>
                <td className="td">{f.line}</td>
                <td className="td">{f.suggestion ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
