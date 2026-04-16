import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const response = await api.post('/empresas/login', {
        email,
        senha
      })

      localStorage.setItem('token', response.data.token)
      navigate('/')
    } catch (error) {
      console.error(error)
      setErro(error.response?.data?.erro || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo-box">◻</div>
          <h1>OPME Manager</h1>
          <p>Acesse sua conta para gerenciar produtos</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}