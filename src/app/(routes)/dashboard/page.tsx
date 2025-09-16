'use client'

import { useEffect, useState } from 'react'
import { getHealth } from '@/lib/api'

export default function DashboardPage() {
  const [data, setData] = useState<any>()
  const [err, setErr] = useState<string>()

  useEffect(() => {
    getHealth()
      .then(setData)
      .catch(e => setErr(String(e)))
  }, [])

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100">
      <h2 className="font-semibold text-lg mb-3">Dashboard</h2>
      {err && <pre className="text-red-400">TypeError: {err}</pre>}
      {!err && <pre className="text-slate-300 text-sm">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}