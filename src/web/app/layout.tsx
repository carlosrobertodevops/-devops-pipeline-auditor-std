import './styles/globals.css'
export const metadata={ title:'DevOps Pipeline Auditor', description:'Audit CI/CD pipelines' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang="pt-br"><body><div className="container">
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
      <h1 style={{margin:0}}>DevOps Pipeline Auditor</h1>
      <nav style={{display:'flex',gap:12}}>
        <a className="badge" href="/dashboard">Dashboard</a>
        <a className="badge" href="/repositories">Repositórios</a>
        <a className="badge" href="/findings">Findings</a>
      </nav>
    </header>
    {children}
  </div></body></html>)
}