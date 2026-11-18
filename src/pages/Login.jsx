import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { api, erroDaApi } from '../services/api'
import { Logo } from '../components/Layout'

export default function Login() {
  const [modo, setModo] = useState('login')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const cadastro = modo === 'cadastro'

  if (localStorage.getItem('token')) return <Navigate to="/" replace />

  function trocar(m) {
    setModo(m)
    setErro('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (cadastro && !nome.trim()) return setErro('Informe o nome da empresa.')
    if (!email.trim() || !senha) return setErro('Informe e-mail e senha.')
    if (cadastro && senha.length < 6) return setErro('A senha precisa ter ao menos 6 caracteres.')

    setErro('')
    setLoading(true)
    try {
      if (cadastro) await api.post('/empresas/cadastro', { nome: nome.trim(), email: email.trim(), senha })
      const { data } = await api.post('/empresas/login', { email: email.trim(), senha })
      localStorage.setItem('token', data.token)
      localStorage.setItem('empresa', JSON.stringify(data.empresa))
      navigate('/')
    } catch (error) {
      setErro(erroDaApi(error, cadastro ? 'Erro ao criar conta' : 'Erro ao fazer login'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="brand"><Logo claro /> Soluções OPME</div>
        <div>
          <h1>Venda antes de o produto vencer.</h1>
          <p>Cadastre seus materiais, importe planilhas e veja o que está perto da validade, com prazo e alerta por produto.</p>
        </div>
        <div className="demo s-urgente" aria-hidden="true">
          <div className="row"><b>Parafuso Ortopédico</b><span>Lote 8841</span></div>
          <div className="row"><span className="demo-s">Urgente</span><span>vence em 25 dias</span></div>
          <div className="gauge"><i style={{ width: '21%' }} /><u style={{ left: '25%' }} /><u style={{ left: '50%' }} /></div>
        </div>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <div className="tabs" role="tablist">
            <button role="tab" type="button" aria-selected={!cadastro} onClick={() => trocar('login')}>Entrar</button>
            <button role="tab" type="button" aria-selected={cadastro} onClick={() => trocar('cadastro')}>Criar conta</button>
          </div>
          <h2>{cadastro ? 'Criar conta da empresa' : 'Entrar na sua empresa'}</h2>
          <p className="muted">{cadastro ? 'Leva menos de um minuto.' : 'Use o e-mail e a senha cadastrados.'}</p>

          <form onSubmit={handleSubmit} noValidate>
            {erro && <p className="msg erro" role="alert">{erro}</p>}
            {cadastro && (
              <div className="field">
                <label htmlFor="nome">Nome da empresa</label>
                <input id="nome" autoComplete="organization" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input id="senha" type="password" autoComplete={cadastro ? 'new-password' : 'current-password'} value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <button className="btn primary block" disabled={loading}>
              {loading ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
