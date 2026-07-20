import { Archive, Flame, RotateCcw, Stamp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { statusClasses, statusLabel } from '@/lib/helpers'
import type { StatusCaso } from '@/lib/types'

const icons: Record<StatusCaso, typeof Archive> = {
  arquivado: Archive,
  'em reabertura': RotateCcw,
  'em andamento': Flame,
  resolvido: Stamp,
}

export function StatusBadge({
  status,
  className,
}: {
  status: StatusCaso
  className?: string
}) {
  const Icon = icons[status]
  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 rounded-sm px-2.5 py-0.5 font-sans text-xs font-semibold uppercase tracking-wide',
        statusClasses[status],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {statusLabel[status]}
    </Badge>
  )
}
