import { brl, dataBR, nivel, prazoTexto, ROTULO } from '../utils'

export function ListHeader() {
  return (
    <div className="cols" aria-hidden="true">
      <span>Produto</span><span>Cidade</span><span className="num">Qtd.</span>
      <span className="num">Preço</span><span>Validade</span>
    </div>
  )
}

// A barra vai de 0 a 120 dias; as marcas ficam em 30 e 60 dias, as faixas da API.
export default function ProductRow({ p }) {
  const d = p.diasParaVencer
  const k = nivel(d)
  const prazo = prazoTexto(d)
  const pct = d < 0 ? 100 : Math.max(3, Math.min(100, (d / 120) * 100))

  return (
    <article className={`item s-${k}`}>
      <div>
        <div className="nome">{p.nomeTecnico}</div>
        <div className="sub">{p.marca}, lote {p.lote}</div>
      </div>
      <div>{p.cidade}</div>
      <div className="num">{p.quantidade}<span className="sr"> unidades</span></div>
      <div className="num">{brl(p.preco)}</div>
      <div className="val">
        <div className="val-top">
          <span><b>{dataBR(p.validade)}</b> <span className="sub">{prazo}</span></span>
          <span className="badge">{d < 0 ? 'Vencido' : ROTULO[k]}</span>
        </div>
        <div className="gauge" role="img" aria-label={prazo}>
          <i style={{ width: `${pct}%` }} /><u style={{ left: '25%' }} /><u style={{ left: '50%' }} />
        </div>
      </div>
    </article>
  )
}
