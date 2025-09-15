import '../styles/globals.css'
import React from 'react'

export const metadata = { title: 'DevOps Pipeline Auditor', description: 'Audit CI/CD pipelines' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="pt-br">
      <body>
        <div className="container-app">
          <header className="flex items-center justify-between mb-4">
            <h1 className="m-0 text-xl font-bold">DevOps Pipeline Auditor</h1>
            <nav className="flex gap-3">
              <a className="nav-link" href="/dashboard">Dashboard</a>
              <a className="nav-link" href="/repositories">Repositórios</a>
              <a className="nav-link" href="/findings">Findings</a>
              <a className="nav-link" href="/billing">Billing</a>
              <a className="nav-link" href="/profile">Perfil</a>
              <a className="nav-link" href="/auth/login">Login</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
