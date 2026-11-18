import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'
import ProductRow, { ListHeader } from '../components/ProductRow'
import { nivel } from '../utils'

const ORDEM = {
  validade: (a, b) => a.diasParaVencer - b.diasParaVencer,
  '-validade': (a, b) => b.diasParaVencer - a.diasParaVencer,
  nome: (a, b) => a.nomeTecnico.localeCompare(b.nomeTecnico, 'pt-BR'),
  valor: (a, b) => b.preco * b.quantidade - a.preco * a.quantidade
}
const FILTROS = [
  ['todos', 'c-all', 'Todos'],
  ['urgente', 'c-bad', 'Urgentes'],
  ['atencao', 'c-warn', 'Atenção'],
  ['normal', 'c-ok', 'Normais']
]

export default function Products() {
  const { produtos, loading, erro, recarregar } = useProdutos()
  const [params, setParams] = useSearchParams()
  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState('')
  const [ordem, setOrdem] = useState('validade')
  const filtro = params.get('status') || 'todos'

  const cidades = useMemo(
    () => [...new Set(produtos.map((p) => p.cidade))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [produtos]
  )
  const cont = { todos: produtos.length, urgente: 0, atencao: 0, normal: 0 }
  produtos.forEach((p) => cont[nivel(p.diasParaVencer)]++)

  const q = busca.trim().toLowerCase()
  const lista = produtos
    .filter((p) =>
      (filtro === 'todos' || nivel(p.diasParaVencer) === filtro) &&
      (!cidade || p.cidade === cidade) &&
      (!q || [p.nomeTecnico, p.marca, p.lote].some((v) => String(v).toLowerCase().includes(q)))
    )
    .sort(ORDEM[ordem])

  return (
    <>
      <div className="head">
        <div>
          <h1>Produtos</h1>
          <p className="muted">{loading ? 'Carregando produtos…' : `Mostrando ${lista.length} de ${produtos.length} ${produtos.length === 1 ? 'produto' : 'produtos'}.`}</p>
        </div>
        <div className="actions">
          <Link className="btn" to="/produtos/upload">Importar planilha</Link>
          <Link className="btn primary" to="/produtos/novo">Novo produto</Link>
        </div>
      </div>

      <div className="filters" role="group" aria-label="Filtrar por situação">
        {FILTROS.map(([k, c, l]) => (
          <button key={k} className={`pill ${c}`} aria-pressed={filtro === k}
            onClick={() => setParams(k === 'todos' ? {} : { status: k })}>
            {l} <b>{cont[k]}</b>
          </button>
        ))}
      </div>

      <div className="tools">
        <div><label className="sr" htmlFor="q">Buscar</label>
          <input id="q" type="search" placeholder="Buscar por produto, marca ou lote" value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
        <div><label className="sr" htmlFor="cidade">Cidade</label>
          <select id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}>
            <option value="">Todas as cidades</option>
            {cidades.map((c) => <option key={c}>{c}</option>)}
          </select></div>
        <div><label className="sr" htmlFor="ordem">Ordenar</label>
          <select id="ordem" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
            <option value="validade">Vence primeiro</option>
            <option value="-validade">Vence por último</option>
            <option value="nome">Nome (A–Z)</option>
            <option value="valor">Maior valor em estoque</option>
          </select></div>
      </div>

      <div className="list">
        {loading ? (
          <><div className="skel" /><div className="skel" /><div className="skel" /></>
        ) : erro ? (
          <div className="empty"><h3>Não foi possível carregar</h3>{erro}<br /><button className="btn" onClick={recarregar}>Tentar de novo</button></div>
        ) : produtos.length === 0 ? (
          <div className="empty"><h3>Seu estoque está vazio</h3>Cadastre o primeiro produto ou importe uma planilha.<br /><Link className="btn primary" to="/produtos/novo">Novo produto</Link></div>
        ) : lista.length === 0 ? (
          <div className="empty"><h3>Nada encontrado</h3>Ajuste a busca ou os filtros para ver outros produtos.</div>
        ) : (
          <>
            <ListHeader />
            {lista.map((p) => <ProductRow key={p.id} p={p} />)}
          </>
        )}
      </div>
    </>
  )
}
