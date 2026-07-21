'use client'

import { useState } from 'react'
import { Check, X, MapPin, User } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  casosAnunciados as casosAnunciadosIniciais,
  formatarValor,
  statusAnuncioLabel,
  statusAnuncioClasses,
  type CasoAnunciado,
} from '@/lib/casos-anunciados'

export default function CasosAnunciadosPage() {
  const [casos, setCasos] = useState<CasoAnunciado[]>(casosAnunciadosIniciais)

  function responder(id: string, novoStatus: 'aceito' | 'recusado') {
    setCasos((prev) => prev.map((c) => (c.id === id ? { ...c, status: novoStatus } : c)))
  }

  const abertos = casos.filter((c) => c.status === 'aberto')
  const respondidos = casos.filter((c) => c.status !== 'aberto')

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow="Marketplace de Casos"
        title="Casos Anunciados"
        description="Casos propostos diretamente por clientes, com valor ofertado. Aceite os que fizerem sentido para você investigar."
      />

      <div className="mt-8 flex flex-col gap-4">
        {abertos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum caso aberto para propostas no momento.
          </p>
        ) : (
          abertos.map((caso) => (
            <Card key={caso.id} className="lamp-hover leather border-border/70">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-sm text-[0.65rem] uppercase',
                        statusAnuncioClasses[caso.status],
                      )}
                    >
                      {statusAnuncioLabel[caso.status]}
                    </Badge>
                    <span className="file-stamp text-[0.6rem] text-muted-foreground">
                      {caso.categoria}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-foreground text-pretty">
                    {caso.titulo}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {caso.descricao}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {caso.cidade}/{caso.estado}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5" aria-hidden="true" />
                      {caso.anuncianteNome}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                  <span className="font-serif text-2xl font-bold text-primary">
                    {formatarValor(caso.valorOferecido)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={() => responder(caso.id, 'recusado')}
                    >
                      <X className="size-3.5" aria-hidden="true" />
                      Recusar
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={() => responder(caso.id, 'aceito')}>
                      <Check className="size-3.5" aria-hidden="true" />
                      Aceitar Caso
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {respondidos.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-foreground">Já respondidos</h2>
          <div className="mt-4 flex flex-col gap-3">
            {respondidos.map((caso) => (
              <Card key={caso.id} className="border-border/50 opacity-70">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-sans text-sm font-medium text-foreground">{caso.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {caso.cidade}/{caso.estado} · {formatarValor(caso.valorOferecido)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-sm text-[0.65rem] uppercase',
                      statusAnuncioClasses[caso.status],
                    )}
                  >
                    {statusAnuncioLabel[caso.status]}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-center font-serif text-sm italic text-muted-foreground">
        {'"Todo caso começa com alguém disposto a pagar pela verdade."'}
      </p>
    </div>
  )
}
