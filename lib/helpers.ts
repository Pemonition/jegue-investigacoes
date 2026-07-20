import {
  casos,
  casosResolvidosPorInvestigador,
  delegacias,
  depoimentos,
  evidencias,
  investigadores,
  juizes,
  locais,
  suspeitos,
  testemunhas,
  vitimas,
} from './mock-data'
import type { Pessoa, StatusCaso } from './types'

// Índice de todas as pessoas do sistema (para resolver depoimentos etc.)
let _indicePessoas: Map<number, Pessoa> | null = null
function indicePessoas() {
  if (_indicePessoas) return _indicePessoas
  const m = new Map<number, Pessoa>()
  ;[
    ...vitimas.map((v) => v.pessoa),
    ...testemunhas.map((t) => t.pessoa),
    ...suspeitos.map((s) => s.pessoa),
    ...investigadores.map((i) => i.pessoa),
    ...juizes.map((j) => j.pessoa),
  ].forEach((p) => m.set(p.id, p))
  _indicePessoas = m
  return m
}

export const pessoaPorId = (id: number) => indicePessoas().get(id)
export const nomePessoa = (id: number) => indicePessoas().get(id)?.nome ?? 'Desconhecido'
export const delegaciaPorId = (id: number) => delegacias.find((d) => d.id === id)
export const localPorId = (id: number) => locais.find((l) => l.id === id)

export function formatarData(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function anoDe(iso: string | null): number | null {
  if (!iso) return null
  return new Date(iso + 'T00:00:00').getFullYear()
}

export function idade(nascimentoIso: string, refIso?: string): number {
  const nasc = new Date(nascimentoIso + 'T00:00:00')
  const ref = refIso ? new Date(refIso + 'T00:00:00') : new Date()
  let a = ref.getFullYear() - nasc.getFullYear()
  const m = ref.getMonth() - nasc.getMonth()
  if (m < 0 || (m === 0 && ref.getDate() < nasc.getDate())) a--
  return a
}

export const statusLabel: Record<StatusCaso, string> = {
  arquivado: 'Arquivado',
  'em reabertura': 'Em Reabertura',
  'em andamento': 'Em Andamento',
  resolvido: 'Resolvido',
}

// Classes de cor por status (usando tokens do tema).
export const statusClasses: Record<StatusCaso, string> = {
  arquivado: 'border-muted-foreground/40 bg-muted text-muted-foreground',
  'em reabertura': 'border-primary/50 bg-primary/15 text-primary',
  'em andamento': 'border-accent/50 bg-accent/20 text-accent-foreground',
  resolvido: 'border-wax/60 bg-wax/20 text-foreground',
}

// ---- Dados derivados por caso ----
export const vitimasDoCaso = (id: number) => vitimas.filter((v) => v.caso_id === id)
export const testemunhasDoCaso = (id: number) => testemunhas.filter((t) => t.caso_id === id)
export const depoimentosDoCaso = (id: number) => depoimentos.filter((d) => d.caso_id === id)
export const evidenciasDoCaso = (id: number) => evidencias.filter((e) => e.caso_id === id)
export const suspeitosDoCaso = (id: number) => suspeitos.filter((s) => s.casos_ids.includes(id))
export const investigadoresDoCaso = (id: number) =>
  investigadores.filter((i) => i.casos_ids.includes(id))
export const casoPorId = (id: number) => casos.find((c) => c.id === id)

export function temAnaliseDna(texto: string): boolean {
  const t = texto.toLowerCase()
  return t.includes('dna') || t.includes('genétic') || t.includes('genetic')
}

// ================= RELATÓRIOS (10 consultas) =================

// 1. Crimes registrados há mais de 20 anos
export function crimesAntigos() {
  const limite = new Date().getFullYear() - 20
  return casos
    .filter((c) => (anoDe(c.data_ocorrido) ?? 9999) <= limite)
    .map((c) => ({
      id: c.id,
      numero: c.numero,
      titulo: c.titulo,
      data: c.data_ocorrido,
      status: c.status,
    }))
    .sort((a, b) => a.data.localeCompare(b.data))
}

// 2. Casos ordenados por número de evidências
export function casosPorEvidencias() {
  return casos
    .map((c) => ({
      caso: c,
      total: evidencias.filter((e) => e.caso_id === c.id).length,
    }))
    .sort((a, b) => b.total - a.total)
}

// 3. Suspeitos associados a mais de um caso
export function suspeitosMultiCaso() {
  return suspeitos.filter((s) => s.casos_ids.length > 1)
}

// 4. Testemunhas com depoimentos de alta confiabilidade
export function testemunhasAltaConfiabilidade() {
  const altas = depoimentos.filter((d) => d.confiabilidade === 'Alta')
  const pessoaIds = new Set(altas.map((d) => d.pessoa_id))
  return testemunhas
    .filter((t) => pessoaIds.has(t.pessoa.id))
    .map((t) => ({
      testemunha: t,
      depoimentos: altas.filter((d) => d.pessoa_id === t.pessoa.id),
    }))
}

// 5. Cidades com mais casos arquivados
export function cidadesComCasosArquivados() {
  const mapa = new Map<string, number>()
  casos
    .filter((c) => c.status === 'arquivado')
    .forEach((c) => mapa.set(c.cidade, (mapa.get(c.cidade) ?? 0) + 1))
  return Array.from(mapa.entries())
    .map(([cidade, total]) => ({ cidade, total }))
    .sort((a, b) => b.total - a.total)
}

// 6. Evidências coletadas nos últimos 6 meses
export function evidenciasRecentes(mesesRef = 6) {
  const limite = new Date()
  limite.setMonth(limite.getMonth() - mesesRef)
  return evidencias
    .filter((e) => new Date(e.data_coleta + 'T00:00:00') >= limite)
    .sort((a, b) => b.data_coleta.localeCompare(a.data_coleta))
}

// 7. Evidências com análise de DNA/genética disponível
export function evidenciasComDna() {
  return evidencias.filter((e) => temAnaliseDna(e.analise_forense_disponivel))
}

// 8. Investigadores por número de casos resolvidos
export function investigadoresPorResolvidos() {
  return investigadores
    .map((i) => ({
      investigador: i,
      resolvidos: casosResolvidosPorInvestigador[i.id] ?? 0,
    }))
    .sort((a, b) => b.resolvidos - a.resolvidos)
}

// 9. Casos não resolvidos onde um suspeito específico aparece
export function casosNaoResolvidosDoSuspeito(suspeitoId: number) {
  const s = suspeitos.find((x) => x.id === suspeitoId)
  if (!s) return []
  return casos.filter(
    (c) => s.casos_ids.includes(c.id) && c.status !== 'resolvido',
  )
}

// 10. Perfil das vítimas: idade média e distribuição por ocupação
export function perfilVitimas() {
  const idades = vitimas.map((v) => idade(v.pessoa.data_nascimento))
  const idadeMedia = Math.round(
    idades.reduce((acc, n) => acc + n, 0) / idades.length,
  )
  const porOcupacao = new Map<string, number>()
  vitimas.forEach((v) =>
    porOcupacao.set(v.ocupacao, (porOcupacao.get(v.ocupacao) ?? 0) + 1),
  )
  return {
    idadeMedia,
    porOcupacao: Array.from(porOcupacao.entries()).map(([ocupacao, total]) => ({
      ocupacao,
      total,
    })),
  }
}

// KPIs do dashboard
export function contagemPorStatus() {
  const base: Record<StatusCaso, number> = {
    arquivado: 0,
    'em reabertura': 0,
    'em andamento': 0,
    resolvido: 0,
  }
  casos.forEach((c) => (base[c.status] += 1))
  return base
}
