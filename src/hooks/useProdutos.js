import { useEffect, useState } from 'react'
import { api, erroDaApi } from '../services/api'

export function useProdutos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    api
      .get('/produtos')
      .then((r) => ativo && setProdutos(r.data))
      .catch((e) => ativo && setErro(erroDaApi(e, 'Erro ao buscar produtos')))
      .finally(() => ativo && setLoading(false))
    return () => {
      ativo = false
    }
  }, [tentativa])

  const recarregar = () => {
    setLoading(true)
    setErro('')
    setTentativa((t) => t + 1)
  }

  return { produtos, loading, erro, recarregar }
}
