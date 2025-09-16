import '../styles/globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'DevOps Pipeline Auditor',
  description: 'MVP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-slate-950 text-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <header className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold">DevOps Pipeline Auditor</div>
            <nav className="flex gap-2 text-sm">
              <Link className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700" href="/dashboard">Dashboard</Link>
              <Link className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700" href="/repositories">Repositórios</Link>
              <Link className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700" href="/findings">Findings</Link>
              <Link className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700" href="/billing">Billing</Link>
              <Link className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700" href="/profile">Perfil</Link>
              <Link className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700" href="/auth/login">Login</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}

// import '../styles/globals.css'
// import React from 'react'

// export const metadata = { title: 'DevOps Pipeline Auditor', description: 'Audit CI/CD pipelines' }

// export default function RootLayout({ children }: { children: React.ReactNode }){
//   return (
//     <html lang="pt-br">
//       <body>
//         <div className="container-app">
//           <header className="flex items-center justify-between mb-4">
//             <h1 className="m-0 text-xl font-bold">DevOps Pipeline Auditor</h1>
//             <nav className="flex gap-3">
//               <a className="nav-link" href="/dashboard">Dashboard</a>
//               <a className="nav-link" href="/repositories">Repositórios</a>
//               <a className="nav-link" href="/findings">Findings</a>
//               <a className="nav-link" href="/billing">Billing</a>
//               <a className="nav-link" href="/profile">Perfil</a>
//               <a className="nav-link" href="/auth/login">Login</a>
//             </nav>
//           </header>
//           {children}
//         </div>
//       </body>
//     </html>
//   )
// }
