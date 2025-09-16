'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { apiLogin, setToken } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(''); setLoading(true)
    try {
      const { token } = await apiLogin({ email, password })
      setToken(token)
      router.push('/profile')
    } catch (e: any) {
      setMsg(e?.message || 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-100 max-w-md">
      <h2 className="font-semibold text-lg mb-3">Login</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2" placeholder="e-mail" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full bg-slate-800/70 border border-slate-700 rounded-lg px-3 py-2" placeholder="senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {msg && <div className="mt-3 text-red-400">{msg}</div>}
      <div className="mt-4 text-sm">
        <Link href="/">Voltar</Link>
      </div>
    </div>
  )
}


// 'use client'

// import React, { useState } from 'react'
// import Link from 'next/link'
// import { apiLogin, setToken } from '@/lib/api'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [msg, setMsg] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setMsg(null)
//     setLoading(true)
//     try {
//       const { access_token } = await apiLogin(email, password)
//       setToken(access_token)
//       setMsg('Login realizado! Você já pode acessar o Dashboard.')
//     } catch (err: any) {
//       setMsg(err?.message || 'Falha no login')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="card">
//       <h2 className="text-lg font-semibold mb-4">Login</h2>
//       <form onSubmit={onSubmit} className="flex flex-col gap-3">
//         <input
//           className="px-3 py-2 rounded bg-white/10 border border-white/10"
//           placeholder="email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           className="px-3 py-2 rounded bg-white/10 border border-white/10"
//           placeholder="senha"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button className="btn" disabled={loading}>
//           {loading ? 'Entrando...' : 'Entrar'}
//         </button>
//       </form>

//       {msg && <p className="mt-3 text-sm text-slate-300">{msg}</p>}

//       <div className="mt-4 text-sm">
//         <Link className="nav-link" href="/dashboard">
//           Ir para o Dashboard
//         </Link>
//       </div>
//     </div>
//   )
// }