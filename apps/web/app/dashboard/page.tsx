'use client'
import { useEffect, useState } from 'react'
import { getHealth } from '@/lib/api'
export default function Dashboard(){ const [health,setHealth]=useState(null); const [err,setErr]=useState(''); useEffect(()=>{ getHealth().then(setHealth).catch(e=>setErr(String(e))) },[]); return(<div className="card"><h2>Dashboard</h2><pre>{health?JSON.stringify(health,null,2):(err||'Carregando...')}</pre></div>) }
