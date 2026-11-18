import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Token vencido ou inválido: limpa a sessão e volta para o login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const naoEhLogin = !error.config?.url?.includes('/empresas/')
    if (error.response?.status === 401 && naoEhLogin) {
      localStorage.removeItem('token')
      localStorage.removeItem('empresa')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const erroDaApi = (error, padrao) =>
  error.response?.data?.erro ||
  (error.request ? 'Não foi possível conectar à API. Confira se o servidor está rodando.' : padrao)
