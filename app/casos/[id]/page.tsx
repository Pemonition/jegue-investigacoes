import { notFound } from 'next/navigation'
import { CasoDetail } from '@/components/casos/caso-detail'
import {
  casos,
  depoimentos,
  evidencias,
  investigadores,
  suspeitos,
  testemunhas,
  vitimas,
} from '@/lib/mock-data'

export function generateStaticParams() {
  return casos.map((c) => ({ id: String(c.id) }))
}

export default async function CasoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const casoId = Number(id)
  const caso = casos.find((c) => c.id === casoId)

  if (!caso) {
    notFound()
  }

  return (
    <CasoDetail
      caso={caso}
      vitimas={vitimas.filter((v) => v.caso_id === casoId)}
      suspeitos={suspeitos.filter((s) => s.casos_ids.includes(casoId))}
      testemunhas={testemunhas.filter((t) => t.caso_id === casoId)}
      depoimentos={depoimentos.filter((d) => d.caso_id === casoId)}
      evidencias={evidencias.filter((e) => e.caso_id === casoId)}
      investigadores={investigadores.filter((i) =>
        i.casos_ids.includes(casoId),
      )}
    />
  )
}
