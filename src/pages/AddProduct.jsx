import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './AddProduct.css'

export default function AddProduct() {
  const [formData, setFormData] = useState({
    nomeTecnico: '',
    marca: '',
    lote: '',
    validade: '',
    quantidade: '',
    cidade: '',
    preco: ''
  })

  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem('')
    setErro('')

    try {
      await api.post('/produtos', {
        ...formData,
        quantidade: Number(formData.quantidade),
        preco: Number(formData.preco)
      })

      setMensagem('Produto cadastrado com sucesso!')
      setFormData({
        nomeTecnico: '',
        marca: '',
        lote: '',
        validade: '',
        quantidade: '',
        cidade: '',
        preco: ''
      })
    } catch (error) {
      console.error(error)
      setErro(error.response?.data?.erro || 'Erro ao cadastrar produto')
    }
  }

  return (
    <div className="add-product-page">
      <header className="topbar">
        <div className="logo-area">
          <div className="logo-box">◻</div>
          <span className="logo-text">OPME Manager</span>
        </div>

        <nav className="dashboard-nav">
          <Link to="/" className="nav-button">
            Dashboard
          </Link>

          <Link to="/produtos" className="nav-button">
            Produtos
          </Link>

          <Link to="/produtos/novo" className="nav-button active">
            Adicionar
          </Link>

          <Link to="/produtos/upload" className="nav-button">
            Importar
          </Link>
        </nav>
      </header>

      <section className="add-product-header">
        <h1>Adicionar Produto</h1>
        <p>Cadastre manualmente um novo produto no sistema</p>
      </section>

      <section className="form-wrapper">
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nome Técnico</label>
              <input
                type="text"
                name="nomeTecnico"
                value={formData.nomeTecnico}
                onChange={handleChange}
                placeholder="Digite o nome técnico"
              />
            </div>

            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Digite a marca"
              />
            </div>

            <div className="form-group">
              <label>Lote</label>
              <input
                type="text"
                name="lote"
                value={formData.lote}
                onChange={handleChange}
                placeholder="Digite o lote"
              />
            </div>

            <div className="form-group">
              <label>Validade</label>
              <input
                type="date"
                name="validade"
                value={formData.validade}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                placeholder="Digite a quantidade"
              />
            </div>

            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Digite a cidade"
              />
            </div>

            <div className="form-group">
              <label>Preço</label>
              <input
                type="number"
                step="0.01"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                placeholder="Digite o preço"
              />
            </div>
          </div>

          {mensagem && <p className="success-message">{mensagem}</p>}
          {erro && <p className="error-message">{erro}</p>}

          <button type="submit" className="submit-button">
            Salvar Produto
          </button>
        </form>
      </section>
    </div>
  )
}