'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Dna, FlaskConical, MapPin, Package, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  casoPorId,
  delegaciaPorId,
  formatarData,
  localPorId,
  temAnaliseDna,
} from '@/lib/helpers'
import type { Evidencia } from '@/lib/types'

export function EvidenciasList({ evidencias }: { evidencias: Evidencia[] }) {
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [apenasDna, setApenasDna] = useState(false)

  const tiposUnicos = Array.from(new Set(evidencias.map((e) => e.tipo)))

  const filtradas = useMemo(() => {
    return evidencias.filter((e) => {
      const texto = `${e.descricao} ${e.tipo} ${e.observacoes}`.toLowerCase()
      const okBusca = texto.includes(busca.toLowerCase())
      const okTipo = tipo === 'todos' || e.tipo === tipo
      const okDna = !apenasDna || temAnaliseDna(e.analise_forense_disponivel)
      return okBusca && okTipo && okDna
    })
  }, [evidencias, busca, tipo, apenasDna])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border/60 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Depósito de Provas
        </p>
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
          Evidências
        </h1>
        <p className="max-w-2xl font-sans leading-relaxed text-muted-foreground">
          Cada objeto etiquetado e lacrado no arquivo. Vestígios que aguardam a
          análise forense capaz de reabrir um caso adormecido.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar por descrição ou tipo..."
            className="pl-10 font-sans"
          />
        </div>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-full font-sans lg:w-52">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {tiposUnicos.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={() => setApenasDna((v) => !v)}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-sm border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors',
            apenasDna
              ? 'border-accent/60 bg-accent/20 text-accent-foreground'
              : 'border-border bg-secondary text-muted-foreground hover:text-foreground',
          )}
        >
          <Dna className="size-4" /> Com DNA
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtradas.map((e) => {
          const dna = temAnaliseDna(e.analise_forense_disponivel)
          const caso = casoPorId(e.caso_id)
          const local = localPorId(e.local_id)
          const delegacia = delegaciaPorId(e.delegacia_id)
          return (
            <Card key={e.id} className="paper relative overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-secondary text-primary">
                      <Package className="size-5" />
                    </div>
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        Prova #{String(e.id).padStart(3, '0')}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 border-primary/40 bg-primary/10 font-mono text-[0.65rem] uppercase capitalize text-primary"
                      >
                        {e.tipo}
                      </Badge>
                    </div>
                  </div>
                  {dna && (
                    <span className="inline-flex items-center gap-1 rounded-sm border border-accent/60 bg-accent/20 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-accent-foreground">
                      <Dna className="size-3" /> DNA
                    </span>
                  )}
                </div>

                <p className="font-serif text-base leading-relaxed text-foreground">
                  {e.descricao}
                </p>

                <div className="flex flex-col gap-2 border-t border-border/50 pt-3 font-sans text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <FlaskConical className="mt-0.5 size-4 shrink-0 text-primary/70" />
                    <span>{e.analise_forense_disponivel}</span>
                  </div>
                  {local && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
                      <span>
                        {local.descricao} — {local.endereco.cidade}/
                        {local.endereco.estado}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    Coletada em {formatarData(e.data_coleta)}
                  </span>
                  {caso && (
                    <Link
                      href={`/casos/${caso.id}`}
                      className="rounded-sm border border-primary/30 bg-secondary px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary transition-colors hover:bg-primary/15"
                    >
                      {caso.numero}
                    </Link>
                  )}
                </div>

                {delegacia && (
                  <p className="font-sans text-xs text-muted-foreground">
                    Custódia: {delegacia.nome}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtradas.length === 0 && (
        <p className="mt-12 text-center font-sans text-muted-foreground">
          Nenhuma evidência corresponde aos filtros.
        </p>
      )}
    </div>
  )
}
