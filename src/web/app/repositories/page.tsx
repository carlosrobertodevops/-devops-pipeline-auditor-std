'use client'
import { useEffect, useState } from 'react'
import { getRepos, triggerScan } from '@/lib/api'
export default function Repositories(){ const [repos,setRepos]=useState([]); const [loading,setLoad]=useState(true); const [msg,setMsg]=useState('')
useEffect(()=>{ getRepos().then(setRepos).catch(e=>setMsg(String(e))).finally(()=>setLoad(false)) },[])
const onScan=async(id)=>{ setMsg('Disparando scan...'); try{ await triggerScan(id); setMsg('Scan disparado! Atualize em alguns minutos.') } catch(e){ setMsg(String(e)) } }
return(<div className="card"><h2>Repositórios</h2>{loading?'Carregando...':(<table className="table"><thead><tr><th>Nome</th><th>Branch</th><th>Score</th><th></th></tr></thead><tbody>{repos.map((r)=>(<tr key={r.id}><td>{r.fullName}</td><td><span className="badge">{r.defaultBranch}</span></td><td>{r.score ?? '-'}</td><td><button className="btn" onClick={()=>onScan(r.id)}>Scan</button></td></tr>))}</tbody></table>)}<p>{msg}</p></div>) }
