'use client'
import { useEffect, useState } from 'react'
import { getHealth } from '@/lib/api'

export default function Dashboard(){
  const [health, setHealth] = useState<any>(null)
  const [err, setErr] = useState<string>('')

  useEffect(()=>{ getHealth().then(setHealth).catch(e=>setErr(String(e))) },[])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
      <pre className="text-slate-300 whitespace-pre-wrap">
        {health ? JSON.stringify(health, null, 2) : (err || 'Carregando...')}
      </pre>
    </div>
  )
}
