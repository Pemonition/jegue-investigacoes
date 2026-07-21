'use client'

import { useState, type FormEvent } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { categoriasCaso, formatarValor } from '@/lib/casos-anunciados'

export default function AnunciarCasoPage() {
  const [enviado, setEnviado] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [descricao, setDescricao] = useState('')
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-8">
        <span className="brass-frame flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-serif text-2xl font-bold text-foreground">
          Caso publicado com sucesso
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
          &ldquo;{titulo}&rdquo; foi enviado para a rede de investigadores da Jegue
          Investigações, com valor ofertado de {formatarValor(Number(valor) || 0)}.
          Você será notificado assim que um investigador aceitar o caso.
        </p>
        <p className="file-stamp mt-6 text-xs text-muted-foreground">
          Esta é uma demonstração — casos publicados aqui não são salvos entre sessões.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow="Área do Cliente"
        title="Anunciar um Caso"
        description="Descreva sua situação e proponha um valor. Investigadores da nossa rede poderão aceitar seu caso."
      />

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <Card className="leather border-border/70">
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título do caso</Label>
              <Input
                id="titulo"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Localização de pessoa desaparecida"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select required value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasCaso.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="valor">Valor ofertado (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Ex: 2500"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  required
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  required
                  maxLength={2}
                  value={estado}
                  onChange={(e) => setEstado(e.target.value.toUpperCase())}
                  placeholder="SP"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descricao">Descreva o caso</Label>
              <Textarea
                id="descricao"
                required
                rows={5}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Conte os detalhes relevantes para o investigador avaliar o caso."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Seu nome (ou &quot;Anônimo&quot;)</Label>
              <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="self-start gap-2">
          <Send className="size-4" aria-hidden="true" />
          Publicar Caso
        </Button>
      </form>
    </div>
  )
}
