export const brl = (n) =>
  Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const dataBR = (iso) =>
  new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' })

// Mesmas faixas da API: até 30 dias urgente, até 60 atenção
export const nivel = (dias) => (dias <= 30 ? 'urgente' : dias <= 60 ? 'atencao' : 'normal')

export const ROTULO = { urgente: 'Urgente', atencao: 'Atenção', normal: 'Normal' }

export function prazoTexto(d) {
  if (d < 0) return `venceu há ${-d} ${-d === 1 ? 'dia' : 'dias'}`
  if (d === 0) return 'vence hoje'
  return `vence em ${d} ${d === 1 ? 'dia' : 'dias'}`
}
