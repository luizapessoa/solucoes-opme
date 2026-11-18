import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, erroDaApi } from '../services/api'

const COLUNAS = ['nomeTecnico', 'marca', 'lote', 'validade', 'quantidade', 'cidade', 'preco']

export default function UploadProducts() {
  const [file, setFile] = useState(null)
  const [sobre, setSobre] = useState(false)
  const [total, setTotal] = useState(null)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function escolher(f) {
    setTotal(null)
    if (f && !/\.xlsx$/i.test(f.name)) {
      setFile(null)
      return setErro('Envie um arquivo .xlsx.')
    }
    setErro('')
    setFile(f || null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return setErro('Selecione uma planilha antes de enviar.')
    const fd = new FormData()
    fd.append('file', file)
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post('/produtos/upload', fd)
      setTotal(data.total)
      setFile(null)
    } catch (error) {
      setErro(erroDaApi(error, 'Erro ao importar planilha'))
    } finally {
      setLoading(false)
    }
  }

  // O back-end lê validade com new Date(): texto AAAA-MM-DD evita datas erradas do Excel
  async function baixarModelo() {
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.aoa_to_sheet([
      COLUNAS,
      ['Parafuso Ortopédico', 'Marca Exemplo', 'L-1001', '2027-03-15', 10, 'Recife', 189.9]
    ])
    ws['!cols'] = [22, 16, 12, 12, 12, 14, 10].map((wch) => ({ wch }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Produtos')
    XLSX.writeFile(wb, 'modelo-produtos-opme.xlsx')
  }

  return (
    <>
      <div className="head"><div><h1>Importar planilha</h1><p className="muted">Cadastre vários produtos de uma vez com um arquivo .xlsx.</p></div></div>
      <div className="upload">
        <aside className="card">
          <h2 className="sec">Como preparar</h2>
          <p className="muted">Na primeira linha da primeira aba, use estas colunas:</p>
          <div className="codes">{COLUNAS.map((c) => <code key={c}>{c}</code>)}</div>
          <p className="muted">Escreva a validade como texto no formato AAAA-MM-DD, por exemplo 2027-03-15.</p>
          <button type="button" className="btn" onClick={baixarModelo}>Baixar modelo pronto</button>
        </aside>

        <form className="card" onSubmit={handleSubmit}>
          {total !== null && <p className="msg ok" role="status">{total} {total === 1 ? 'produto importado' : 'produtos importados'}. <Link to="/produtos">Ver produtos</Link></p>}
          {erro && <p className="msg erro" role="alert">{erro}</p>}
          <label
            className={`drop${sobre ? ' over' : ''}`} htmlFor="file"
            onDragOver={(e) => { e.preventDefault(); setSobre(true) }}
            onDragLeave={() => setSobre(false)}
            onDrop={(e) => { e.preventDefault(); setSobre(false); escolher(e.dataTransfer.files[0]) }}
          >
            <strong>{file ? file.name : 'Escolha o arquivo ou solte aqui'}</strong>
            Somente .xlsx
          </label>
          <input id="file" type="file" accept=".xlsx" className="sr" onChange={(e) => escolher(e.target.files[0])} />
          <div className="foot">
            <button className="btn primary" disabled={!file || loading}>{loading ? 'Importando…' : 'Importar produtos'}</button>
          </div>
        </form>
      </div>
    </>
  )
}
