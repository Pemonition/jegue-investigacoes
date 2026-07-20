import { cn } from '@/lib/utils'

// Selo de cera vitoriano usado para status "resolvido"/"arquivado".
export function WaxSeal({
  label = 'JI',
  variant = 'wax',
  className,
}: {
  label?: string
  variant?: 'wax' | 'brass'
  className?: string
}) {
  const isWax = variant === 'wax'
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex size-14 shrink-0 items-center justify-center rounded-full',
        'font-serif text-sm font-bold uppercase tracking-widest',
        'shadow-[inset_0_2px_6px_rgba(0,0,0,0.4),0_3px_8px_rgba(0,0,0,0.35)]',
        isWax
          ? 'bg-[oklch(0.42_0.14_22)] text-[oklch(0.9_0.04_40)]'
          : 'bg-[oklch(0.6_0.1_78)] text-[oklch(0.22_0.03_55)]',
        className,
      )}
      style={{
        maskImage:
          'radial-gradient(circle at center, black 62%, transparent 63%), radial-gradient(circle at 20% 24%, black 8%, transparent 9%)',
      }}
    >
      <span className="absolute inset-1 rounded-full border border-current/40" />
      <span className="relative">{label}</span>
    </span>
  )
}
