import Link from 'next/link'
import {
  Archive,
  ArrowUpRight,
  Flame,
  Folder,
  Microscope,
  RotateCcw,
  Stamp,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import {
  ChartLegend,
  DonutChart,
  HorizontalBars,
} from '@/components/charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { casos, evidencias } from '@/lib/mock-data'
import {
  casoPorId,
  cidadesComCasosArquivados,
  contagemPorStatus,
  evidenciasRecentes,
  formatarData,
} from '@/lib/helpers'

export default function DashboardPage() {
  const contagem = contagemPorStatus()
  const total = casos.length

  const kpis = [
    { label: 'Total de Casos', value: total, icon: Folder, tone: 'text-primary' },
    { label: 'Arquivados', value: contagem.arquivado, icon: Archive, tone: 'text-muted-foreground' },
    { label: 'Em Reabertura', value: contagem['em reabertura'], icon: RotateCcw, tone: 'text-primary' },
    { label: 'Em Andamento', value: contagem['em andamento'], icon: Flame, tone: 'text-accent-foreground' },
    { label: 'Resolvidos', value: contagem.resolvido, icon: Stamp, tone: 'text-wax' },
  ]

  const cidades = cidadesComCasosArquivados().map((c) => ({
    label: c.cidade,
    value: c.total,
  }))

  const porTipo = Object.entries(
    casos.reduce<Record<string, number>>((acc, c) => {
      acc[c.tipo] = (acc[c.tipo] ?? 0) + 1
      return acc
    }, {}),
  ).map(([label, value]) => ({ label, value }))

  const recentes = evidenciasRecentes(12).slice(0, 5)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow="Arquivo Central — 2026"
        title="Gabinete de Investigação"
        description="Panorama geral dos casos não resolvidos sob custódia da agência Jegue Investigações. Cada dossiê aguarda o olhar atento do detetive."
      />

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} className="lamp-hover leather border-border/70">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <k.icon className={`size-5 ${k.tone}`} aria-hidden="true" />
                <span className="file-stamp text-[0.6rem] text-muted-foreground">
                  Nº
                </span>
              </div>
              <div>
                <p className="font-serif text-4xl font-bold text-foreground">
                  {String(k.value).padStart(2, '0')}
                </p>
                <p className="mt-1 font-sans text-xs uppercase tracking-wide text-muted-foreground">
                  {k.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Casos arquivados por cidade */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              Casos Arquivados por Cidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HorizontalBars data={cidades} color="var(--chart-1)" />
          </CardContent>
        </Card>

        {/* Tipos de crime */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              Natureza dos Crimes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <DonutChart data={porTipo} />
            <ChartLegend data={porTipo} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Evidências recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <Microscope className="size-5 text-primary" aria-hidden="true" />
              Evidências Recentes
            </CardTitle>
            <Link
              href="/evidencias"
              className="flex items-center gap-1 font-sans text-xs text-primary hover:underline"
            >
              Ver todas <ArrowUpRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {recentes.map((e) => {
              const caso = casoPorId(e.caso_id)
              return (
                <div
                  key={e.id}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-sm font-medium text-foreground">
                      {e.descricao}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {e.tipo} · {caso?.titulo}
                    </p>
                  </div>
                  <span className="file-stamp shrink-0 text-[0.65rem] text-primary">
                    {formatarData(e.data_coleta)}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Casos em destaque */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Casos em Foco</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {casos
              .filter((c) => c.status === 'em andamento' || c.status === 'em reabertura')
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/casos/${c.id}`}
                  className="lamp-hover flex flex-col gap-2 rounded-sm border border-border/70 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="file-stamp text-[0.6rem] text-primary">
                      Caso Nº {c.numero}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="font-serif text-sm font-semibold text-foreground text-pretty">
                    {c.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.cidade}/{c.estado}
                  </p>
                </Link>
              ))}
          </CardContent>
        </Card>
      </div>

      <p className="mt-10 text-center font-serif text-sm italic text-muted-foreground">
        {'"Elementar, meu caro Watson — os fatos aguardam interpretação."'}
      </p>
    </div>
  )
}
