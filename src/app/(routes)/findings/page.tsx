'use client'

import { useEffect, useState } from 'react'
import { Finding, getFindings } from '@/lib/api'

export default function FindingsPage() {
  const [items, setItems] = useState<Finding[]>([])
  const [err, setErr] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getFindings()
      .then(setItems)
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100">
      <h2 className="font-semibold text-lg mb-3">Findings</h2>
      {err && <div className="text-red-400">{err}</div>}
      {!err && (
        <ul className="space-y-2">
          {items.map(f => (
            <li key={f.id} className="bg-slate-800/50 rounded-lg px-3 py-2">
              <div className="font-medium">{f.rule} <span className="text-xs">({f.severity})</span></div>
              <div className="text-xs text-slate-400">{f.file ? `${f.file}:${f.line ?? 0}` : 'sem arquivo/linha'}</div>
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="text-slate-400">Carregando...</div>}
    </div>
  )
}


// 'use client'

// import React, { useEffect, useState } from 'react'
// import { getFindings, type Finding } from '@/lib/api'

// type UIFinding = Finding & { file: string; line: number }

// export default function FindingsPage() {
//   const [items, setItems] = useState<UIFinding[]>([])
//   const [loading, setLoading] = useState(true)
//   const [err, setErr] = useState<string | null>(null)

//   useEffect(() => {
//     getFindings()
//       .then((list) =>
//         setItems(
//           list.map((f) => ({
//             ...f,
//             file: f.file ?? '-',
//             line: typeof f.line === 'number' ? f.line : 0,
//           }))
//         )
//       )
//       .catch((e) => setErr(String(e)))
//       .finally(() => setLoading(false))
//   }, [])

//   if (loading) return <div className="card">Carregando findings…</div>
//   if (err) return <div className="card text-red-400">Erro: {err}</div>

//   return (
//     <div className="container-app">
//       <h2 className="text-xl font-bold mb-4">Findings</h2>

//       {items.length === 0 ? (
//         <div className="card">Nenhum finding encontrado.</div>
//       ) : (
//         <div className="card overflow-x-auto">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th className="th">Repo</th>
//                 <th className="th">Regra</th>
//                 <th className="th">Severidade</th>
//                 <th className="th">Arquivo</th>
//                 <th className="th">Linha</th>
//                 <th className="th">Criado em</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((f) => (
//                 <tr key={f.id}>
//                   <td className="td">{f.repoId}</td>
//                   <td className="td">{f.rule}</td>
//                   <td className="td">
//                     <span className="badge">
//                       {f.severity.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="td">{f.file}</td>
//                   <td className="td">{f.line}</td>
//                   <td className="td">
//                     {new Date(f.createdAt).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }