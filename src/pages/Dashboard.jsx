import { useEffect, useState } from 'react'
import { api } from '../services/api'
import './Dashboard.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {

  const [produtos, setProdutos] = useState([])
  const navigate = useNavigate()
  
  function handleLogout() {
  localStorage.removeItem('token')
  navigate('/login')
}

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await api.get('/produtos')
        setProdutos(response.data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      }
    }

    buscarProdutos()
  }, [])

  const normal = produtos.filter(p => p.statusValidade === 'normal').length
  const atencao = produtos.filter(p => p.statusValidade === 'atenção').length
  const urgente = produtos.filter(p => p.statusValidade === 'urgente').length

  // 👉 O RETURN TEM QUE ESTAR AQUI DENTRO
  return (
    <div className="dashboard-page">

      <nav className="dashboard-nav">
  <Link to="/" className="nav-button active">Dashboard</Link>
  <Link to="/produtos" className="nav-button">Produtos</Link>
  <Link to="/produtos/novo" className="nav-button">Adicionar</Link>
  <Link to="/produtos/upload" className="nav-button">Importar</Link>
  <button onClick={handleLogout} className="nav-button">
    Sair
  </button>
</nav>

      <h1>Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total de Produtos</h3>
          <strong>{produtos.length}</strong>
        </div>

        <div className="summary-card normal">
          <h3>Status Normal</h3>
          <strong>{normal}</strong>
        </div>

        <div className="summary-card warning">
          <h3>Requer Atenção</h3>
          <strong>{atencao}</strong>
        </div>

        <div className="summary-card danger">
          <h3>Urgente</h3>
          <strong>{urgente}</strong>
        </div>
      </div>

    </div>
  )
}