import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const links = [
  ['/', 'Painel', true],
  ['/produtos', 'Produtos'],
  ['/produtos/novo', 'Adicionar'],
  ['/produtos/upload', 'Importar']
]

export function Logo({ claro }) {
  return (
    <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true">
      <rect width="30" height="30" rx="8" fill={claro ? '#2fb0cf' : '#0a6c86'} />
      <circle cx="15" cy="15" r="8" fill="none" stroke={claro ? '#12222c' : '#fff'} strokeWidth="2.4" />
      <path d="M15 10v5l3 2" stroke={claro ? '#12222c' : '#fff'} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function Layout() {
  const navigate = useNavigate()
  const empresa = JSON.parse(localStorage.getItem('empresa') || 'null')

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('empresa')
    navigate('/login')
  }

  return (
    <>
      <header className="top">
        <div className="top-in">
          <div className="brand"><Logo /> Soluções OPME</div>
          <nav className="nav" aria-label="Principal">
            {links.map(([to, rotulo, end]) => (
              <NavLink key={to} to={to} end={end}>{rotulo}</NavLink>
            ))}
          </nav>
          <div className="who">
            {empresa && <span>{empresa.nome}</span>}
            <button className="btn ghost" onClick={sair}>Sair</button>
          </div>
        </div>
      </header>
      <main className="page"><Outlet /></main>
    </>
  )
}
