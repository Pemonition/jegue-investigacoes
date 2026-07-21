'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileSearch,
  Fingerprint,
  Gauge,
  ScrollText,
  Microscope,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/casos', label: 'Casos', icon: FileSearch },
  { href: '/suspeitos', label: 'Suspeitos', icon: Fingerprint },
  { href: '/evidencias', label: 'Evidências', icon: Microscope },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText },
]

function Logo({ large = false }: { large?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-full',
          large ? 'size-16' : 'size-11',
        )}
      >
        <Image
          src="/logo-jegue.png"
          alt="Jegue Investigações"
          width={large ? 64 : 44}
          height={large ? 64 : 44}
          className="size-full object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif font-bold tracking-wide text-foreground', large ? 'text-2xl' : 'text-lg')}>
          Jegue
        </span>
        <span className={cn('file-stamp text-primary', large ? 'text-xs' : 'text-[0.62rem]')}>
          Investigações
        </span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 z-30 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-5 py-8 md:flex">
  <div className="px-2">
    <Logo large />
  </div>
  <nav className="mt-12 flex flex-col gap-2">
    {nav.map((item) => {
      const active = isActive(item.href)
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'lamp-hover flex items-center gap-3.5 rounded-sm border border-transparent px-4 py-3 font-sans text-[0.95rem] text-sidebar-foreground/80',
            active && 'border-primary/40 bg-sidebar-accent text-primary shadow-[inset_3px_0_0_0_var(--primary)]',
          )}
          aria-current={active ? 'page' : undefined}
        >
          <item.icon className="size-5 shrink-0" aria-hidden="true" />
          <span className="font-medium tracking-wide">{item.label}</span>
        </Link>
      )
    })}
  </nav>
  {/* resto (bloco "Arquivo Central") continua igual */}
</aside>
      {/* Top bar (mobile) */}
      <header className="sticky top-0 z-30 flex flex-col border-b border-sidebar-border bg-sidebar md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
          {nav.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-sm border border-transparent px-3 py-2 text-xs text-sidebar-foreground/80',
                  active && 'border-primary/40 bg-sidebar-accent text-primary',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="size-4" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
