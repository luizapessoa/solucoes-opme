import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, erroDaApi } from '../services/api'

const VAZIO = { nomeTecnico: '', marca: '', lote: '', validade: '', quantidade: '', cidade: '', preco: '' }
const ROTULOS = { nomeTecnico: 'Nome técnico', marca: 'Marca', lote: 'Lote', validade: 'Validade', quantidade: 'Quantidade', cidade: 'Cidade', preco: 'Preço' }

export default function AddProduct() {
  const [form, setForm] = useState(VAZIO)
  const [ok, setOk] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setOk(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setOk(false)
    const faltando = Object.keys(ROTULOS).find((k) => String(form[k]).trim() === '')
    if (faltando) return setErro(`${ROTULOS[faltando]} é obrigatório.`)
    const quantidade = parseInt(form.quantidade, 10)
    const preco = parseFloat(form.preco)
    if (!(quantidade >= 0) || !(preco >= 0)) return setErro('Quantidade e preço precisam ser números positivos.')

    setErro('')
    setLoading(true)
    try {
      await api.post('/produtos', {
        ...form,
        nomeTecnico: form.nomeTecnico.trim(), marca: form.marca.trim(),
        lote: form.lote.trim(), cidade: form.cidade.trim(), quantidade, preco
      })
      setForm(VAZIO)
      setOk(true)
    } catch (error) {
      setErro(erroDaApi(error, 'Erro ao cadastrar produto'))
    } finally {
      setLoading(false)
    }
  }

  const campo = (name, rotulo, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{rotulo}</label>
      <input id={name} name={name} value={form[name]} onChange={handleChange} {...props} />
    </div>
  )

  return (
    <>
      <div className="head"><div><h1>Novo produto</h1><p className="muted">Todos os campos são obrigatórios.</p></div></div>
      <form className="card form" onSubmit={handleSubmit} noValidate>
        {ok && <p className="msg ok" role="status">Produto salvo. <Link to="/produtos">Ver produtos</Link></p>}
        {erro && <p className="msg erro" role="alert">{erro}</p>}
        {campo('nomeTecnico', 'Nome técnico', { placeholder: 'Ex.: Parafuso Ortopédico' })}
        <div className="g2">
          {campo('marca', 'Marca')}
          {campo('lote', 'Lote')}
          {campo('validade', 'Validade', { type: 'date' })}
          {campo('quantidade', 'Quantidade', { type: 'number', min: 0, step: 1 })}
          {campo('cidade', 'Cidade')}
          {campo('preco', 'Preço (R$)', { type: 'number', min: 0, step: '0.01' })}
        </div>
        <div className="foot">
          <Link className="btn ghost" to="/produtos">Cancelar</Link>
          <button className="btn primary" disabled={loading}>{loading ? 'Salvando…' : 'Salvar produto'}</button>
        </div>
      </form>
    </>
  )
}
