import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './Products.css'

export default function Products() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const response = await api.get('/produtos')
        setProdutos(response.data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    buscarProdutos()
  }, [])

  return (
    <div className="products-page">
      <header className="topbar">
        <div className="logo-area">
          <div className="logo-box">◻</div>
          <span className="logo-text">OPME Manager</span>
        </div>

        <nav className="dashboard-nav">
          <Link to="/" className="nav-button">
            Dashboard
          </Link>

          <Link to="/produtos" className="nav-button active">
            Produtos
          </Link>

          <button className="nav-button">Adicionar</button>
          <button className="nav-button">Importar</button>
        </nav>
      </header>

      <section className="products-header">
        <h1>Produtos</h1>
        <p>Lista de produtos cadastrados no sistema</p>
      </section>

      <section className="products-table-wrapper">
        {loading ? (
          <p className="products-message">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p className="products-message">Nenhum produto cadastrado.</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Nome Técnico</th>
                <th>Marca</th>
                <th>Lote</th>
                <th>Validade</th>
                <th>Cidade</th>
                <th>Preço</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nomeTecnico}</td>
                  <td>{produto.marca}</td>
                  <td>{produto.lote}</td>
                  <td>{new Date(produto.validade).toLocaleDateString('pt-BR')}</td>
                  <td>{produto.cidade}</td>
                  <td>
                    {produto.preco.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </td>
                  <td>
                    <span className={`status-badge ${produto.statusValidade}`}>
                      {produto.statusValidade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}