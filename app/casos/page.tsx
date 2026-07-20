import { PageHeader } from '@/components/page-header'
import { CasosList } from '@/components/casos/casos-list'
import { casos } from '@/lib/mock-data'

export const metadata = {
  title: 'Casos — Jegue Investigações',
}

export default function CasosPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow="Arquivo de Dossiês"
        title="Casos Não Resolvidos"
        description="Todos os crimes sob custódia da agência. Filtre por status, cidade e período, ou busque pela descrição do dossiê."
      />
      <CasosList casos={casos} />
    </div>
  )
}
