import { EvidenciasList } from '@/components/evidencias/evidencias-list'
import { evidencias } from '@/lib/mock-data'

export default function EvidenciasPage() {
  return <EvidenciasList evidencias={evidencias} />
}
