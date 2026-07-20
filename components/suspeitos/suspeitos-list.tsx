'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ScanFace, Search } from 'lucide-react'
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
import { idade } from '@/lib/helpers'
import type { Suspeito } from '@/lib/types'

const statusClasses: Record<string, string> = {
  foragido: 'border-destructive/50 bg-destructive/20 text-foreground',
  detido: 'border-primary/50 bg-primary/15 text-primary',
  indiciado: 'border-accent/50 bg-accent/20 text-accent-foreground',
  inocentado: 'border-border bg-muted text-muted-foreground',
}

export function SuspeitosList({ suspeitos }: { suspeitos: Suspeito[] }) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('todos')

  const filtrados = useMemo(() => {
    return suspeitos.filter((s) => {
      const texto =
        `${s.pessoa.nome} ${s.pessoa.apelido} ${s.acusacao} ${s.motivo}`.toLowerCase()
      const okBusca = texto.includes(busca.toLowerCase())
      const okStatus = status === 'todos' || s.status === status
      return okBusca && okStatus
    })
  }, [suspeitos, busca, status])

  const statusUnicos = Array.from(new Set(suspeitos.map((s) => s.status)))

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-2 border-b border-border/60 pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Galeria dos Procurados
        </p>
        <h1 className="font-serif text-4xl font-bold text-primary sm:text-5xl">
          Suspeitos
        </h1>
        <p className="max-w-2xl font-sans leading-relaxed text-muted-foreground">
          Fichas dos indivíduos ligados aos crimes em aberto. Cada retrato guarda
          um motivo, uma acusação e um paradeiro incerto.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Procurar por nome, alcunha ou acusação..."
            className="pl-10 font-sans"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full font-sans sm:w-56">
            <SelectValue placeholder="Situação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as situações</SelectItem>
            {statusUnicos.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((s) => (
          <Card key={s.id} className="leather brass-frame overflow-hidden">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-sm border border-primary/40 bg-secondary text-primary">
                  <ScanFace className="size-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="font-serif text-lg font-bold leading-tight text-foreground text-balance">
                    {s.pessoa.nome}
                  </h2>
                  {s.pessoa.apelido && (
                    <p className="font-mono text-xs uppercase tracking-wider text-primary">
                      &ldquo;{s.pessoa.apelido}&rdquo;
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'font-mono text-[0.65rem] uppercase capitalize',
                        statusClasses[s.status] ??
                          'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {s.status}
                    </Badge>
                    <span className="font-sans text-xs text-muted-foreground">
                      {idade(s.pessoa.data_nascimento)} anos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-border/50 pt-3">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    Acusação
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-foreground">
                    {s.acusacao}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    Motivo presumido
                  </p>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {s.motivo}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                {s.possui_antecedentes ? (
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs text-destructive">
                    <AlertTriangle className="size-3.5" /> Com antecedentes
                  </span>
                ) : (
                  <span className="font-sans text-xs text-muted-foreground">
                    Sem antecedentes
                  </span>
                )}
                <span className="font-mono text-xs text-muted-foreground">
                  {s.casos_ids.length} caso(s)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {s.casos_ids.map((cid) => (
                  <Link
                    key={cid}
                    href={`/casos/${cid}`}
                    className="rounded-sm border border-primary/30 bg-secondary px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary transition-colors hover:bg-primary/15"
                  >
                    Caso #{cid}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className="mt-12 text-center font-sans text-muted-foreground">
          Nenhum suspeito corresponde à busca.
        </p>
      )}
    </div>
  )
}
