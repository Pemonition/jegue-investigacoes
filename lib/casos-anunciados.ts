export type StatusAnuncio = 'aberto' | 'aceito' | 'recusado'

export interface CasoAnunciado {
  id: string
  titulo: string
  categoria: string
  cidade: string
  estado: string
  descricao: string
  anuncianteNome: string
  valorOferecido: number
  dataPublicacao: string
  status: StatusAnuncio
}

export const categoriasCaso = [
  'Desaparecimento',
  'Fraude',
  'Infidelidade Conjugal',
  'Furto/Roubo',
  'Ameaça',
  'Outro',
] as const

export const casosAnunciados: CasoAnunciado[] = [
  {
    id: 'anun-001',
    titulo: 'Desaparecimento de documentos da empresa',
    categoria: 'Fraude',
    cidade: 'São Paulo',
    estado: 'SP',
    descricao:
      'Suspeita de desvio de contratos internos nos últimos 3 meses. Necessário investigador com experiência em fraude corporativa.',
    anuncianteNome: 'Marcos V.',
    valorOferecido: 3500,
    dataPublicacao: '2026-06-02',
    status: 'aberto',
  },
  {
    id: 'anun-002',
    titulo: 'Localização de pessoa desaparecida',
    categoria: 'Desaparecimento',
    cidade: 'Curitiba',
    estado: 'PR',
    descricao:
      'Familiar desaparecido há 2 semanas. Última localização conhecida no centro da cidade.',
    anuncianteNome: 'Fernanda R.',
    valorOferecido: 5200,
    dataPublicacao: '2026-06-10',
    status: 'aberto',
  },
  {
    id: 'anun-003',
    titulo: 'Investigação de infidelidade conjugal',
    categoria: 'Infidelidade Conjugal',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    descricao: 'Acompanhamento discreto solicitado por 10 dias úteis.',
    anuncianteNome: 'Anônimo',
    valorOferecido: 1800,
    dataPublicacao: '2026-06-14',
    status: 'aceito',
  },
  {
    id: 'anun-004',
    titulo: 'Ameaças recorrentes por vizinho',
    categoria: 'Ameaça',
    cidade: 'Salvador',
    estado: 'BA',
    descricao: 'Coleta de evidências para futuro boletim de ocorrência.',
    anuncianteNome: 'Carla M.',
    valorOferecido: 900,
    dataPublicacao: '2026-06-18',
    status: 'aberto',
  },
]

export function formatarValor(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(valor)
}

export const statusAnuncioLabel: Record<StatusAnuncio, string> = {
  aberto: 'Aberto para Propostas',
  aceito: 'Aceito',
  recusado: 'Recusado',
}

export const statusAnuncioClasses: Record<StatusAnuncio, string> = {
  aberto: 'border-primary/50 text-primary bg-primary/10',
  aceito: 'border-accent/50 text-accent-foreground bg-accent/20',
  recusado: 'border-destructive/50 text-destructive bg-destructive/10',
}
