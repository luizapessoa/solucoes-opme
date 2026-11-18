import { Link } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'
import ProductRow, { ListHeader } from '../components/ProductRow'
import { brl, nivel } from '../utils'

const CARDS = [
  ['todos', 'c-all', 'Todos os produtos', ''],
  ['urgente', 'c-bad', 'Urgentes', 'vencem em até 30 dias'],
  ['atencao', 'c-warn', 'Atenção', 'vencem em até 60 dias'],
  ['normal', 'c-ok', 'Normais', 'mais de 60 dias']
]

export default function Dashboard() {
  const { produtos, loading, erro, recarregar } = useProdutos()
  const empresa = JSON.parse(localStorage.getItem('empresa') || 'null')

  const cont = { todos: produtos.length, urgente: 0, atencao: 0, normal: 0 }
  produtos.forEach((p) => cont[nivel(p.diasParaVencer)]++)
  const risco = produtos
    .filter((p) => nivel(p.diasParaVencer) === 'urgente')
    .reduce((s, p) => s + p.preco * p.quantidade, 0)
  const proximos = [...produtos].sort((a, b) => a.diasParaVencer - b.diasParaVencer).slice(0, 5)

  return (
    <>
      <div className="head">
        <div>
          <h1>Painel</h1>
          <p className="muted">{empresa ? `Situação do estoque de ${empresa.nome}.` : 'Situação do seu estoque.'}</p>
        </div>
        <div className="actions">
          <Link className="btn" to="/produtos/upload">Importar planilha</Link>
          <Link className="btn primary" to="/produtos/novo">Novo produto</Link>
        </div>
      </div>

      {erro ? (
        <div className="list"><div className="empty"><h3>Não foi possível carregar</h3>{erro}<br /><button className="btn" onClick={recarregar}>Tentar de novo</button></div></div>
      ) : (
        <>
          <div className="sum">
            {CARDS.map(([k, c, l, s]) => (
              <Link key={k} to={k === 'todos' ? '/produtos' : `/produtos?status=${k}`} className={`chip ${c}`}>
                <span className="n">{loading ? '–' : cont[k]}</span>
                <span className="l">{l}{s && <small>{s}</small>}</span>
              </Link>
            ))}
          </div>

          {risco > 0 && <p className="risk">Valor em estoque nos itens urgentes: <strong>{brl(risco)}</strong></p>}

          <h2 className="sec">Vencem primeiro</h2>
          <div className="list">
            {loading ? (
              <><div className="skel" /><div className="skel" /><div className="skel" /></>
            ) : proximos.length === 0 ? (
              <div className="empty">
                <h3>Seu estoque está vazio</h3>
                Cadastre o primeiro produto ou importe uma planilha com vários de uma vez.<br />
                <Link className="btn primary" to="/produtos/novo">Novo produto</Link>
              </div>
            ) : (
              <>
                <ListHeader />
                {proximos.map((p) => <ProductRow key={p.id} p={p} />)}
              </>
            )}
          </div>
          {produtos.length > 5 && <p className="more"><Link to="/produtos">Ver todos os {produtos.length} produtos</Link></p>}
        </>
      )}
    </>
  )
}
