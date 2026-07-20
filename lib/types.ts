// Modelo de dados do Jegue Investigações.
// Espelha o esquema MySQL que será integrado depois — os componentes
// recebem esses tipos via props para facilitar a troca por uma API.

export type StatusCaso =
  | 'arquivado'
  | 'em reabertura'
  | 'em andamento'
  | 'resolvido'

export type Confiabilidade = 'Alta' | 'Media' | 'Baixa'

export interface Endereco {
  id: number
  rua: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export interface Pessoa {
  id: number
  nome: string
  genero: string
  cpf: string
  data_nascimento: string // ISO
  email: string
  telefone: string
  descricao: string
  apelido: string
}

export interface Juiz {
  id: number
  pessoa: Pessoa
  comarca: string
}

export interface Caso {
  id: number
  numero: string // ex: "001 — 1890"
  titulo: string
  descricao: string
  tipo: string // roubo, sequestro, homicídio, incêndio criminoso, fraude
  data_ocorrido: string
  data_arquivamento: string | null
  causa_arquivamento: string | null
  data_ultima_atualizacao: string
  observacoes: string
  status: StatusCaso
  juiz: Juiz | null
  cidade: string
  estado: string
}

export interface Vitima {
  id: number
  caso_id: number
  pessoa: Pessoa
  situacao: string // ex: falecida, sobrevivente, desaparecida
  status: string
  lesao: string
  ocupacao: string
}

export interface Suspeito {
  id: number
  pessoa: Pessoa
  status: string // ex: foragido, detido, inocentado, indiciado
  possui_antecedentes: boolean
  motivo: string
  observacoes: string
  acusacao: string
  ligacao_crime: string
  historico_criminal: string
  casos_ids: number[] // um suspeito pode estar ligado a mais de um caso
}

export interface Testemunha {
  id: number
  caso_id: number
  pessoa: Pessoa
  envolvimento: string
  obs_investigador: string
}

export interface Depoimento {
  id: number
  caso_id: number
  pessoa_id: number
  papel: string // vítima, testemunha, etc.
  texto: string
  data: string
  confiabilidade: Confiabilidade
  observacoes: string
}

export interface Delegacia {
  id: number
  nome: string
  tipo: string
  delegado_responsavel: string
  email_delegado: string
  endereco: Endereco
}

export interface Local {
  id: number
  caso_id: number
  descricao: string
  fotos: string[]
  endereco: Endereco
}

export interface Evidencia {
  id: number
  caso_id: number
  delegacia_id: number
  local_id: number
  tipo: string
  descricao: string
  data_coleta: string
  observacoes: string
  analise_forense_disponivel: string // texto livre, pode mencionar DNA
}

export interface Investigador {
  id: number
  pessoa: Pessoa
  especialidade: string
  casos_ids: number[]
}
