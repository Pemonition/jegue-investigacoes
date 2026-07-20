'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Clock,
  Dna,
  FileSearch,
  Fingerprint,
  MapPinned,
  ScrollText,
  ShieldQuestion,
  Sparkles,
  UserRoundSearch,
  Users,
} from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  casosNaoResolvidosDoSuspeito,
  casosPorEvidencias,
  cidadesComCasosArquivados,
  crimesAntigos,
  evidenciasComDna,
  evidenciasRecentes,
  formatarData,
  investigadoresPorResolvidos,
  perfilVitimas,
  suspeitosMultiCaso,
  testemunhasAltaConfiabilidade,
} from '@/lib/helpers'
import { suspeitos } from '@/lib/mock-data'

type Coluna = { chave: string; titulo: string }

function Tabela({
  colunas,
  linhas,
}: {
  colunas: Coluna[]
  linhas: Record<string, React.ReactNode>[]
}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-border/60">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border/60 bg-secondary/60">
            {colunas.map((c) => (
              <th
                key={c.chave}
                className="px-4 py-3 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground"
              >
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr
              key={i}
              className="border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/40"
            >
              {colunas.map((c) => (
                <td
                  key={c.chave}
                  className="px-4 py-3 align-top font-sans text-sm text-foreground"
                >
                  {linha[c.chave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {linhas.length === 0 && (
        <p className="px-4 py-6 text-center font-sans text-sm text-muted-foreground">
          Sem registros para este relatório.
        </p>
      )}
    </div>
  )
}

function Secao({
  numero,
  titulo,
  descricao,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  numero: number
  titulo: string
  descricao: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [aberto, setAberto] = useState(defaultOpen)
  return (
    <section className="paper brass-frame overflow-hidden rounded-sm">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/40"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-secondary font-serif text-lg font-bold text-primary">
          {String(numero).padStart(2, '0')}
        </span>
        <span className="flex-1">
          <span className="flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            <span className="font-serif text-lg font-bold text-foreground">
              {titulo}
            </span>
          </span>
          <span className="mt-0.5 block font-sans text-sm text-muted-foreground">
            {descricao}
          </span>
        </span>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-muted-foreground transition-transform',
            aberto && 'rotate-180',
          )}
        />
      </button>
      {aberto && <div className="border-t border-border/60 p-5">{children}</div>}
    </section>
  )
}

function CasoLink({ id, label }: { id: number; label: string }) {
  return (
    <Link
      href={`/casos/${id}`}
      className="font-mono text-xs text-primary underline-offset-2 hover:underline"
    >
      {label}
    </Link>
  )
}

export function RelatoriosView() {
  const antigos = crimesAntigos()
  const porEvidencias = casosPorEvidencias()
  const multiCaso = suspeitosMultiCaso()
  const testemunhasAlta = testemunhasAltaConfiabilidade()
  const cidadesArq = cidadesComCasosArquivados()
  const recentes = evidenciasRecentes()
  const comDna = evidenciasComDna()
  const investRes = investigadoresPorResolvidos()
  const perfil = perfilVitimas()

  // Consulta 9: seletor de suspeito
  const [suspeitoSel, setSuspeitoSel] = useState(
    multiCaso[0]?.id ?? suspeitos[0]?.id ?? 0,
  )
  const casosSuspeito = casosNaoResolvidosDoSuspeito(suspeitoSel)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border/60 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Gabinete de Análise
        </p>
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
          Relatórios
        </h1>
        <p className="max-w-2xl font-sans leading-relaxed text-muted-foreground">
          Dez consultas investigativas cruzam os arquivos do departamento em
          busca de padrões que possam reanimar os casos esquecidos.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* 1 */}
        <Secao
          numero={1}
          titulo="Crimes com mais de 20 anos"
          descricao="Ocorrências registradas há mais de duas décadas."
          icon={Clock}
          defaultOpen
        >
          <Tabela
            colunas={[
              { chave: 'numero', titulo: 'Nº' },
              { chave: 'titulo', titulo: 'Caso' },
              { chave: 'data', titulo: 'Ocorrido em' },
              { chave: 'status', titulo: 'Situação' },
            ]}
            linhas={antigos.map((c) => ({
              numero: <CasoLink id={c.id} label={c.numero} />,
              titulo: c.titulo,
              data: formatarData(c.data),
              status: <StatusBadge status={c.status} />,
            }))}
          />
        </Secao>

        {/* 2 */}
        <Secao
          numero={2}
          titulo="Casos por volume de evidências"
          descricao="Ordenados do maior ao menor número de provas."
          icon={FileSearch}
        >
          <Tabela
            colunas={[
              { chave: 'numero', titulo: 'Nº' },
              { chave: 'titulo', titulo: 'Caso' },
              { chave: 'total', titulo: 'Evidências' },
            ]}
            linhas={porEvidencias.map(({ caso, total }) => ({
              numero: <CasoLink id={caso.id} label={caso.numero} />,
              titulo: caso.titulo,
              total: (
                <span className="font-mono font-bold text-primary">{total}</span>
              ),
            }))}
          />
        </Secao>

        {/* 3 */}
        <Secao
          numero={3}
          titulo="Suspeitos em múltiplos casos"
          descricao="Indivíduos ligados a mais de uma investigação."
          icon={Fingerprint}
        >
          <Tabela
            colunas={[
              { chave: 'nome', titulo: 'Suspeito' },
              { chave: 'apelido', titulo: 'Alcunha' },
              { chave: 'casos', titulo: 'Casos vinculados' },
            ]}
            linhas={multiCaso.map((s) => ({
              nome: s.pessoa.nome,
              apelido: s.pessoa.apelido,
              casos: (
                <span className="flex flex-wrap gap-1.5">
                  {s.casos_ids.map((cid) => (
                    <CasoLink key={cid} id={cid} label={`#${cid}`} />
                  ))}
                </span>
              ),
            }))}
          />
        </Secao>

        {/* 4 */}
        <Secao
          numero={4}
          titulo="Testemunhas de alta confiabilidade"
          descricao="Depoimentos classificados como altamente confiáveis."
          icon={Users}
        >
          <Tabela
            colunas={[
              { chave: 'nome', titulo: 'Testemunha' },
              { chave: 'envolvimento', titulo: 'Envolvimento' },
              { chave: 'qtd', titulo: 'Depoimentos' },
            ]}
            linhas={testemunhasAlta.map(({ testemunha, depoimentos }) => ({
              nome: testemunha.pessoa.nome,
              envolvimento: testemunha.envolvimento,
              qtd: (
                <Badge
                  variant="outline"
                  className="border-accent/50 bg-accent/20 font-mono text-accent-foreground"
                >
                  {depoimentos.length} de alta conf.
                </Badge>
              ),
            }))}
          />
        </Secao>

        {/* 5 */}
        <Secao
          numero={5}
          titulo="Cidades com mais casos arquivados"
          descricao="Distribuição geográfica dos arquivamentos."
          icon={MapPinned}
        >
          <Tabela
            colunas={[
              { chave: 'cidade', titulo: 'Cidade' },
              { chave: 'total', titulo: 'Arquivados' },
            ]}
            linhas={cidadesArq.map((c) => ({
              cidade: c.cidade,
              total: (
                <span className="font-mono font-bold text-primary">
                  {c.total}
                </span>
              ),
            }))}
          />
        </Secao>

        {/* 6 */}
        <Secao
          numero={6}
          titulo="Evidências recentes (últimos 6 meses)"
          descricao="Provas coletadas no semestre corrente."
          icon={ScrollText}
        >
          <Tabela
            colunas={[
              { chave: 'tipo', titulo: 'Tipo' },
              { chave: 'descricao', titulo: 'Descrição' },
              { chave: 'data', titulo: 'Coletada em' },
            ]}
            linhas={recentes.map((e) => ({
              tipo: (
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 font-mono capitalize text-primary"
                >
                  {e.tipo}
                </Badge>
              ),
              descricao: e.descricao,
              data: formatarData(e.data_coleta),
            }))}
          />
        </Secao>

        {/* 7 */}
        <Secao
          numero={7}
          titulo="Evidências com análise de DNA"
          descricao="Provas que possuem material genético disponível."
          icon={Dna}
        >
          <Tabela
            colunas={[
              { chave: 'tipo', titulo: 'Tipo' },
              { chave: 'descricao', titulo: 'Descrição' },
              { chave: 'analise', titulo: 'Análise forense' },
            ]}
            linhas={comDna.map((e) => ({
              tipo: (
                <Badge
                  variant="outline"
                  className="border-accent/50 bg-accent/20 font-mono capitalize text-accent-foreground"
                >
                  {e.tipo}
                </Badge>
              ),
              descricao: e.descricao,
              analise: e.analise_forense_disponivel,
            }))}
          />
        </Secao>

        {/* 8 */}
        <Secao
          numero={8}
          titulo="Investigadores por casos resolvidos"
          descricao="Desempenho do corpo investigativo."
          icon={Sparkles}
        >
          <Tabela
            colunas={[
              { chave: 'nome', titulo: 'Investigador' },
              { chave: 'espec', titulo: 'Especialidade' },
              { chave: 'res', titulo: 'Resolvidos' },
            ]}
            linhas={investRes.map(({ investigador, resolvidos }) => ({
              nome: investigador.pessoa.nome,
              espec: investigador.especialidade,
              res: (
                <span className="font-mono font-bold text-primary">
                  {resolvidos}
                </span>
              ),
            }))}
          />
        </Secao>

        {/* 9 */}
        <Secao
          numero={9}
          titulo="Casos não resolvidos por suspeito"
          descricao="Selecione um suspeito para ver seus casos em aberto."
          icon={UserRoundSearch}
        >
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Suspeito
            </label>
            <select
              value={suspeitoSel}
              onChange={(e) => setSuspeitoSel(Number(e.target.value))}
              className="w-full max-w-sm rounded-sm border border-border bg-secondary px-3 py-2 font-sans text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {suspeitos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.pessoa.nome} — {s.pessoa.apelido}
                </option>
              ))}
            </select>
          </div>
          <Tabela
            colunas={[
              { chave: 'numero', titulo: 'Nº' },
              { chave: 'titulo', titulo: 'Caso' },
              { chave: 'status', titulo: 'Situação' },
            ]}
            linhas={casosSuspeito.map((c) => ({
              numero: <CasoLink id={c.id} label={c.numero} />,
              titulo: c.titulo,
              status: <StatusBadge status={c.status} />,
            }))}
          />
        </Secao>

        {/* 10 */}
        <Secao
          numero={10}
          titulo="Perfil das vítimas"
          descricao="Idade média e distribuição por ocupação."
          icon={ShieldQuestion}
        >
          <div className="mb-5 flex items-center gap-4 rounded-sm border border-border/60 bg-secondary/50 p-4">
            <span className="flex size-14 items-center justify-center rounded-sm border border-primary/40 bg-background font-serif text-2xl font-bold text-primary">
              {perfil.idadeMedia}
            </span>
            <div>
              <p className="font-serif text-base font-bold text-foreground">
                Idade média das vítimas
              </p>
              <p className="font-sans text-sm text-muted-foreground">
                Calculada sobre todas as vítimas registradas no sistema.
              </p>
            </div>
          </div>
          <Tabela
            colunas={[
              { chave: 'ocupacao', titulo: 'Ocupação' },
              { chave: 'total', titulo: 'Vítimas' },
            ]}
            linhas={perfil.porOcupacao.map((o) => ({
              ocupacao: o.ocupacao,
              total: (
                <span className="font-mono font-bold text-primary">
                  {o.total}
                </span>
              ),
            }))}
          />
        </Secao>
      </div>
    </div>
  )
}
