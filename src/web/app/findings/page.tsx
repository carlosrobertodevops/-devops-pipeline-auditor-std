'use client'
import { useEffect, useState } from 'react'
import { getFindings } from '@/lib/api'
export default function Findings(){ const [items,setItems]=useState([]); const [loading,setLoad]=useState(true); const [err,setErr]=useState('')
useEffect(()=>{ getFindings().then(setItems).catch(e=>setErr(String(e))).finally(()=>setLoad(false)) },[])
return(<div className="card"><h2>Findings</h2>{loading?'Carregando...':err?err:(<table className="table"><thead><tr><th>Severidade</th><th>Regra</th><th>Arquivo</th><th>Linha</th><th>Sugestão</th></tr></thead><tbody>{items.map((f)=>(<tr key={f.id}><td><span className="badge">{f.severity}</span></td><td>{f.rule}</td><td>{f.file}</td><td>{f.line}</td><td>{f.suggestion ?? '-'}</td></tr>))}</tbody></table>)}</div>) }
