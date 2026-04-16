import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import './Upload.css'

export default function UploadProducts() {
  const [file, setFile] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleFileChange(event) {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)
    setMensagem('')
    setErro('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem('')
    setErro('')

    if (!file) {
      setErro('Selecione uma planilha antes de enviar.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)

      const response = await api.post('/produtos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMensagem(
        `${response.data.mensagem} Total importado: ${response.data.total}`
      )
      setFile(null)
      event.target.reset()
    } catch (error) {
      console.error(error)
      setErro(error.response?.data?.erro || 'Erro ao importar planilha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
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

          <Link to="/produtos/novo" className="nav-button">
            Adicionar
          </Link>

          <Link to="/produtos/upload" className="nav-button active">
            Importar
          </Link>
        </nav>
      </header>

      <section className="upload-header">
        <h1>Importar Planilha</h1>
        <p>Envie uma planilha .xlsx para cadastrar produtos em lote</p>
      </section>

      <section className="upload-wrapper">
        <div className="upload-info">
          <h3>Formato esperado da planilha</h3>
          <ul>
            <li>nomeTecnico</li>
            <li>marca</li>
            <li>lote</li>
            <li>validade</li>
            <li>quantidade</li>
            <li>cidade</li>
            <li>preco</li>
          </ul>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label className="upload-label">Selecione o arquivo .xlsx</label>

          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="file-input"
          />

          {file && <p className="file-name">Arquivo selecionado: {file.name}</p>}

          {mensagem && <p className="success-message">{mensagem}</p>}
          {erro && <p className="error-message">{erro}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Importando...' : 'Importar Planilha'}
          </button>
        </form>
      </section>
    </div>
  )
}