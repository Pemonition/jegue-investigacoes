'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Fingerprint,
  Gavel,
  MapPin,
  Microscope,
  Quote,
  ScrollText,
  Users,
} from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { WaxSeal } from '@/components/wax-seal'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  delegaciaPorId,
  formatarData,
  localPorId,
  nomePessoa,
  temAnaliseDna,
} from '@/lib/helpers'
import type {
  Caso,
  Depoimento,
  Evidencia,
  Investigador,
  Suspeito,
  Testemunha,
  Vitima,
} from '@/lib/types'

const confiabilidadeClasses: Record<string, string> = {
  Alta: 'border-accent/50 bg-accent/20 text-accent-foreground',
  Media: 'border-primary/50 bg-primary/15 text-primary',
  Baixa: 'border-destructive/50 bg-destructive/20 text-foreground',
}

export function CasoDetail({
  caso,
  vitimas,
  suspeitos,
  testemunhas,
  depoimentos,
  evidencias,
  investigadores,
}: {
  caso: Caso
  vitimas: Vitima[]
  suspeitos: Suspeito[]
  testemunhas: Testemunha[]
  depoimentos: Depoimento[]
  evidencias: Evidencia[]
  investigadores: Investigador[]
}) {
  const selado = caso.status === 'resolvido' || caso.status === 'arquivado'

  const timeline = [
    { label: 'Crime ocorrido', data: caso.data_ocorrido },
    { label: 'Arquivamento', data: caso.data_arquivamento },
    { label: 'Última atualização', data: caso.data_ultima_atualizacao },
  ].filter((t) => t.data)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <Link
        href="/casos"
        className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Voltar ao arquivo
      </Link>

      {/* Cabeçalho do dossiê */}
      <div className="leather brass-frame relative flex flex-col gap-5 rounded-sm p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="file-stamp text-xs text-primary">
              Caso Nº {caso.numero}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold text-foreground text-balance sm:text-4xl">
              {caso.titulo}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={caso.status} />
              <Badge
                variant="outline"
                className="rounded-sm border-primary/40 text-primary"
              >
                {caso.tipo}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" /> {caso.cidade}/{caso.estado}
              </span>
            </div>
          </div>
          {selado ? (
            <WaxSeal
              label={caso.status === 'resolvido' ? 'RES' : 'ARQ'}
              variant={caso.status === 'resolvido' ? 'brass' : 'wax'}
              className="hidden sm:flex"
            />
          ) : null}
        </div>

        <div className="parchment rounded-sm p-5">
          <p className="font-sans text-[0.95rem] leading-relaxed">
            {caso.descricao}
          </p>
          {caso.observacoes ? (
            <p className="mt-3 border-t border-current/20 pt-3 font-serif text-sm italic">
              Nota do investigador: {caso.observacoes}
            </p>
          ) : null}
          {caso.causa_arquivamento ? (
            <p className="mt-2 text-xs">
              <span className="file-stamp text-[0.6rem]">
                Causa do arquivamento:{' '}
              </span>
              {caso.causa_arquivamento}
            </p>
          ) : null}
        </div>

        {/* Juiz + Linha do tempo */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-sm border border-border/70 bg-background/40 p-4">
            <p className="file-stamp mb-2 flex items-center gap-1.5 text-[0.6rem] text-primary">
              <Gavel className="size-3.5" /> Magistrado
            </p>
            {caso.juiz ? (
              <>
                <p className="font-serif text-sm font-semibold text-foreground">
                  {caso.juiz.pessoa.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {caso.juiz.comarca}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Não designado</p>
            )}
          </div>

          <div className="rounded-sm border border-border/70 bg-background/40 p-4 md:col-span-2">
            <p className="file-stamp mb-3 text-[0.6rem] text-primary">
              Linha do tempo
            </p>
            <ol className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              {timeline.map((t, i) => (
                <li key={t.label} className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'size-2.5 rounded-full',
                        i === timeline.length - 1
                          ? 'bg-primary'
                          : 'bg-muted-foreground/50',
                      )}
                    />
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {t.label}
                    </span>
                  </span>
                  <span className="font-serif text-sm text-foreground">
                    {formatarData(t.data)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Abas */}
      <Tabs defaultValue="vitimas" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-card p-1">
          <TabsTrigger value="vitimas" className="gap-1.5">
            <Users className="size-4" /> Vítimas ({vitimas.length})
          </TabsTrigger>
          <TabsTrigger value="suspeitos" className="gap-1.5">
            <Fingerprint className="size-4" /> Suspeitos ({suspeitos.length})
          </TabsTrigger>
          <TabsTrigger value="testemunhas" className="gap-1.5">
            <Quote className="size-4" /> Testemunhas ({testemunhas.length})
          </TabsTrigger>
          <TabsTrigger value="evidencias" className="gap-1.5">
            <Microscope className="size-4" /> Evidências ({evidencias.length})
          </TabsTrigger>
          <TabsTrigger value="investigadores" className="gap-1.5">
            <ScrollText className="size-4" /> Investigadores ({investigadores.length})
          </TabsTrigger>
        </TabsList>

        {/* Vítimas */}
        <TabsContent value="vitimas" className="mt-4 grid gap-4 sm:grid-cols-2">
          {vitimas.map((v) => (
            <Card key={v.id} className="lamp-hover">
              <CardContent className="p-5">
                <p className="font-serif text-lg font-semibold text-foreground">
                  {v.pessoa.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {v.pessoa.apelido} · {v.ocupacao}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Info label="Situação" value={v.situacao} />
                  <Info label="Status" value={v.status} />
                  <Info label="Lesão" value={v.lesao} />
                </dl>
              </CardContent>
            </Card>
          ))}
          {vitimas.length === 0 ? <Vazio texto="Nenhuma vítima registrada." /> : null}
        </TabsContent>

        {/* Suspeitos */}
        <TabsContent value="suspeitos" className="mt-4 grid gap-4 sm:grid-cols-2">
          {suspeitos.map((s) => (
            <Link key={s.id} href="/suspeitos">
              <Card className="lamp-hover h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-lg font-semibold text-foreground">
                      {s.pessoa.nome}
                    </p>
                    <Badge
                      variant="outline"
                      className="rounded-sm border-primary/40 text-xs text-primary"
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.pessoa.apelido}</p>
                  <p className="mt-3 text-sm text-foreground/90">
                    <span className="file-stamp text-[0.6rem] text-primary">
                      Acusação:{' '}
                    </span>
                    {s.acusacao}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Motivo: {s.motivo}
                  </p>
                  {s.casos_ids.length > 1 ? (
                    <Badge className="mt-3 rounded-sm bg-wax/20 text-xs text-foreground">
                      Ligado a {s.casos_ids.length} casos
                    </Badge>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
          {suspeitos.length === 0 ? <Vazio texto="Nenhum suspeito vinculado." /> : null}
        </TabsContent>

        {/* Testemunhas + depoimentos */}
        <TabsContent value="testemunhas" className="mt-4 flex flex-col gap-4">
          {testemunhas.map((t) => {
            const deps = depoimentos.filter((d) => d.pessoa_id === t.pessoa.id)
            return (
              <Card key={t.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-serif text-lg font-semibold text-foreground">
                        {t.pessoa.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.envolvimento}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm italic text-muted-foreground">
                    {t.obs_investigador}
                  </p>
                  {deps.map((d) => (
                    <Depo key={d.id} d={d} />
                  ))}
                </CardContent>
              </Card>
            )
          })}
          {/* Depoimentos de outras pessoas (ex: vítimas) */}
          {depoimentos
            .filter(
              (d) => !testemunhas.some((t) => t.pessoa.id === d.pessoa_id),
            )
            .map((d) => (
              <Card key={`extra-${d.id}`}>
                <CardContent className="p-5">
                  <p className="font-serif text-lg font-semibold text-foreground">
                    {nomePessoa(d.pessoa_id)}{' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      · {d.papel}
                    </span>
                  </p>
                  <Depo d={d} />
                </CardContent>
              </Card>
            ))}
          {testemunhas.length === 0 && depoimentos.length === 0 ? (
            <Vazio texto="Nenhuma testemunha ou depoimento." />
          ) : null}
        </TabsContent>

        {/* Evidências */}
        <TabsContent value="evidencias" className="mt-4 grid gap-4 sm:grid-cols-2">
          {evidencias.map((e) => {
            const del = delegaciaPorId(e.delegacia_id)
            const loc = localPorId(e.local_id)
            const dna = temAnaliseDna(e.analise_forense_disponivel)
            return (
              <Card key={e.id} className="lamp-hover">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-sm border-primary/40 text-xs text-primary"
                    >
                      {e.tipo}
                    </Badge>
                    <span className="file-stamp text-[0.6rem] text-muted-foreground">
                      {formatarData(e.data_coleta)}
                    </span>
                  </div>
                  <p className="mt-3 font-sans text-sm font-medium text-foreground">
                    {e.descricao}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {e.analise_forense_disponivel}
                  </p>
                  {dna ? (
                    <Badge className="mt-3 rounded-sm bg-accent/25 text-xs text-accent-foreground">
                      Análise de DNA disponível
                    </Badge>
                  ) : null}
                  <div className="mt-3 flex flex-col gap-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    {loc ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-primary/70" />
                        {loc.descricao}
                      </span>
                    ) : null}
                    {del ? (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-primary/70" />
                        {del.nome}
                      </span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {evidencias.length === 0 ? <Vazio texto="Nenhuma evidência catalogada." /> : null}
        </TabsContent>

        {/* Investigadores */}
        <TabsContent value="investigadores" className="mt-4 grid gap-4 sm:grid-cols-2">
          {investigadores.map((i) => (
            <Card key={i.id} className="lamp-hover">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-serif text-lg font-bold text-primary">
                  {i.pessoa.nome
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div>
                  <p className="font-serif text-lg font-semibold text-foreground">
                    {i.pessoa.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {i.especialidade}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {investigadores.length === 0 ? (
            <Vazio texto="Nenhum investigador designado." />
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="file-stamp text-[0.55rem] text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  )
}

function Depo({ d }: { d: Depoimento }) {
  return (
    <blockquote className="parchment mt-3 rounded-sm border-l-2 border-primary/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="file-stamp text-[0.55rem]">{formatarData(d.data)}</span>
        <Badge
          variant="outline"
          className={cn(
            'rounded-sm text-[0.6rem]',
            confiabilidadeClasses[d.confiabilidade],
          )}
        >
          Confiabilidade {d.confiabilidade}
        </Badge>
      </div>
      <p className="font-serif text-sm italic leading-relaxed">
        {'"'}
        {d.texto}
        {'"'}
      </p>
    </blockquote>
  )
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div className="col-span-full rounded-sm border border-dashed border-border py-12 text-center">
      <p className="font-serif text-muted-foreground">{texto}</p>
    </div>
  )
}
