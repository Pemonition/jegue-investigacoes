'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarClock, MapPin, Search, X } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { anoDe, formatarData } from '@/lib/helpers'
import type { Caso, StatusCaso } from '@/lib/types'

const STATUS: StatusCaso[] = [
  'arquivado',
  'em reabertura',
  'em andamento',
  'resolvido',
]

export function CasosList({ casos }: { casos: Caso[] }) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState<string>('todos')
  const [cidade, setCidade] = useState<string>('todas')
  const [anoDe_, setAnoDe] = useState<string>('')
  const [anoAte, setAnoAte] = useState<string>('')

  const cidades = useMemo(
    () => Array.from(new Set(casos.map((c) => c.cidade))).sort(),
    [casos],
  )

  const filtrados = useMemo(() => {
    return casos.filter((c) => {
      if (busca && !`${c.titulo} ${c.descricao} ${c.numero}`.toLowerCase().includes(busca.toLowerCase()))
        return false
      if (status !== 'todos' && c.status !== status) return false
      if (cidade !== 'todas' && c.cidade !== cidade) return false
      const ano = anoDe(c.data_ocorrido) ?? 0
      if (anoDe_ && ano < Number(anoDe_)) return false
      if (anoAte && ano > Number(anoAte)) return false
      return true
    })
  }, [casos, busca, status, cidade, anoDe_, anoAte])

  const limpar = () => {
    setBusca('')
    setStatus('todos')
    setCidade('todas')
    setAnoDe('')
    setAnoAte('')
  }

  const temFiltro =
    busca || status !== 'todos' || cidade !== 'todas' || anoDe_ || anoAte

  return (
    <div className="mt-8 flex flex-col gap-5">
      {/* Filtros */}
      <div className="flex flex-col gap-3 rounded-sm border border-border bg-card p-4 lg:flex-row lg:items-end lg:gap-4">
        <div className="flex-1">
          <label className="file-stamp mb-1.5 block text-[0.6rem] text-muted-foreground">
            Buscar por descrição
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex: ourivesaria, incêndio, cais..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-end">
          <div>
            <label className="file-stamp mb-1.5 block text-[0.6rem] text-muted-foreground">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {STATUS.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="file-stamp mb-1.5 block text-[0.6rem] text-muted-foreground">
              Cidade
            </label>
            <Select value={cidade} onValueChange={setCidade}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {cidades.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="file-stamp mb-1.5 block text-[0.6rem] text-muted-foreground">
              Ano de
            </label>
            <Input
              type="number"
              value={anoDe_}
              onChange={(e) => setAnoDe(e.target.value)}
              placeholder="1979"
              className="w-full lg:w-24"
            />
          </div>
          <div>
            <label className="file-stamp mb-1.5 block text-[0.6rem] text-muted-foreground">
              Ano até
            </label>
            <Input
              type="number"
              value={anoAte}
              onChange={(e) => setAnoAte(e.target.value)}
              placeholder="2026"
              className="w-full lg:w-24"
            />
          </div>
        </div>

        {temFiltro ? (
          <Button
            variant="ghost"
            onClick={limpar}
            className="gap-1.5 text-muted-foreground"
          >
            <X className="size-4" /> Limpar
          </Button>
        ) : null}
      </div>

      <p className="file-stamp text-xs text-muted-foreground">
        {filtrados.length} de {casos.length} dossiês
      </p>

      {/* Tabela */}
      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-serif">Nº do Caso</TableHead>
              <TableHead className="font-serif">Dossiê</TableHead>
              <TableHead className="font-serif">Local</TableHead>
              <TableHead className="font-serif">Ocorrido</TableHead>
              <TableHead className="font-serif">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((c) => (
              <TableRow
                key={c.id}
                className="lamp-hover cursor-pointer border-border"
                onClick={() => {
                  window.location.href = `/casos/${c.id}`
                }}
              >
                <TableCell>
                  <Link
                    href={`/casos/${c.id}`}
                    className="file-stamp text-xs text-primary"
                  >
                    {c.numero}
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="font-serif text-sm font-semibold text-foreground">
                    {c.titulo}
                  </p>
                  <p className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                    {c.tipo} · {c.descricao}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 text-primary/70" />
                    {c.cidade}/{c.estado}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarClock className="size-3.5 text-primary/70" />
                    {formatarData(c.data_ocorrido)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={c.status} />
                </TableCell>
              </TableRow>
            ))}
            {filtrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <Search className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                  <p className="font-serif text-lg text-muted-foreground">
                    Nenhum dossiê corresponde à investigação.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    Ajuste os filtros e prossiga com a busca.
                  </p>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
