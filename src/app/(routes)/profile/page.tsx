'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiMe, apiUpdateProfile, clearToken } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [me, setMe] = useState<{ id: string; email: string; name?: string } | null>(null)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    apiMe()
      .then(u => { setMe(u); setName(u?.name || '') })
      .catch(() => setMe(null))
  }, [])

  const onSave = async () => {
    setMsg('')
    try {
      const u = await apiUpdateProfile({ name: name || undefined, password: password || undefined })
      setMe(u); setPassword('')
      setMsg('Perfil atualizado!')
    } catch (e: any) {
      setMsg(e?.message || 'Erro ao salvar')
    }
  }

  const onLogout = () => {
    clearToken()
    router.push('/auth/login')
  }

  if (!me) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100">
        <h2 className="font-semibold text-lg mb-3">Perfil</h2>
        <div className="mb-3">Você não está autenticado.</div>
        <Link href="/auth/login" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Ir para o login</Link>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100 max-w-lg">
      <h2 className="font-semibold text-lg mb-3">Perfil</h2>
      <div className="space-y-3">
        <div className="text-sm text-slate-400">E-mail</div>
        <div className="bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">{me.email}</div>

        <div className="text-sm text-slate-400 mt-3">Nome</div>
        <input className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2"
               value={name} onChange={e => setName(e.target.value)} />

        <div className="text-sm text-slate-400 mt-3">Nova senha (opcional)</div>
        <input className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2"
               type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <div className="flex gap-2 mt-4">
          <button onClick={onSave} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">Salvar</button>
          <button onClick={onLogout} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">Sair</button>
        </div>

        {msg && <div className="text-slate-300">{msg}</div>}
      </div>
    </div>
  )
}

// 'use client'

// import React, { useEffect, useState } from 'react'
// import { apiMe, apiUpdateProfile, clearToken } from '@/lib/api'
// import Link from 'next/link'

// export default function ProfilePage() {
//   const [me, setMe] = useState<{ id: string; email: string; name?: string | null } | null>(null)
//   const [name, setName] = useState('')
//   const [password, setPassword] = useState('')
//   const [msg, setMsg] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     let alive = true
//     apiMe()
//       .then((u) => {
//         if (alive) {
//           setMe(u)
//           setName(u.name || '')
//         }
//       })
//       .catch((e) => setMsg(e?.message || 'Falha ao carregar perfil'))
//     return () => {
//       alive = false
//     }
//   }, [])

//   async function onSave(e: React.FormEvent) {
//     e.preventDefault()
//     setMsg(null)
//     setLoading(true)
//     try {
//       await apiUpdateProfile({ name, password: password || undefined })
//       setMsg('Perfil atualizado!')
//       setPassword('')
//     } catch (err: any) {
//       setMsg(err?.message || 'Erro ao atualizar')
//     } finally {
//       setLoading(false)
//     }
//   }

//   function onLogout() {
//     clearToken()
//     setMe(null)
//     setMsg('Sessão encerrada.')
//   }

//   return (
//     <div className="card">
//       <h2 className="text-lg font-semibold mb-4">Perfil</h2>

//       {!me ? (
//         <div className="space-y-3">
//           <p className="text-sm text-slate-300">Você não está autenticado.</p>
//           <Link className="btn" href="/auth/login">Ir para o login</Link>
//         </div>
//       ) : (
//         <form onSubmit={onSave} className="flex flex-col gap-3">
//           <div className="text-sm text-slate-300">Email: {me.email}</div>
//           <input
//             className="px-3 py-2 rounded bg-white/10 border border-white/10"
//             placeholder="nome"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             className="px-3 py-2 rounded bg-white/10 border border-white/10"
//             placeholder="nova senha (opcional)"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <div className="flex items-center gap-3">
//             <button className="btn" disabled={loading}>
//               {loading ? 'Salvando...' : 'Salvar'}
//             </button>
//             <button type="button" className="badge" onClick={onLogout}>
//               Logout
//             </button>
//           </div>
//         </form>
//       )}

//       {msg && <p className="mt-3 text-sm text-slate-300">{msg}</p>}
//     </div>
//   )
// }