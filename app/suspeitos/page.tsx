import { SuspeitosList } from '@/components/suspeitos/suspeitos-list'
import { suspeitos } from '@/lib/mock-data'

export default function SuspeitosPage() {
  return <SuspeitosList suspeitos={suspeitos} />
}
