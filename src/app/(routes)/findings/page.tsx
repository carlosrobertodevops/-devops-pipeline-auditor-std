'use client'

import React, { useEffect, useState } from 'react'
import { getFindings, type Finding } from '@/lib/api'

type UIFinding = Finding & { file: string; line: number }

export default function FindingsPage() {
  const [items, setItems] = useState<UIFinding[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    getFindings()
      .then((list) =>
        setItems(
          list.map((f) => ({
            ...f,
            file: f.file ?? '-',
            line: typeof f.line === 'number' ? f.line : 0,
          }))
        )
      )
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="card">Carregando findings…</div>
  if (err) return <div className="card text-red-400">Erro: {err}</div>

  return (
    <div className="container-app">
      <h2 className="text-xl font-bold mb-4">Findings</h2>

      {items.length === 0 ? (
        <div className="card">Nenhum finding encontrado.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Repo</th>
                <th className="th">Regra</th>
                <th className="th">Severidade</th>
                <th className="th">Arquivo</th>
                <th className="th">Linha</th>
                <th className="th">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id}>
                  <td className="td">{f.repoId}</td>
                  <td className="td">{f.rule}</td>
                  <td className="td">
                    <span className="badge">
                      {f.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="td">{f.file}</td>
                  <td className="td">{f.line}</td>
                  <td className="td">
                    {new Date(f.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}