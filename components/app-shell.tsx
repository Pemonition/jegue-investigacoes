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
  HandCoins,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Dashboard', icon: Gauge },
  { href: '/casos', label: 'Casos', icon: FileSearch },
  { href: '/casos/anunciados', label: 'Casos Anunciados', icon: HandCoins },
  { href: '/suspeitos', label: 'Suspeitos', icon: Fingerprint },
  { href: '/evidencias', label: 'Evidências', icon: Microscope },
  { href: '/relatorios', label: 'Relatórios', icon: ScrollText },
  { href: '/anunciar', label: 'Anunciar Caso', icon: Megaphone },
]

function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full">
        <Image
          src="/logo-jegue.png"
          alt="Jegue Investigações"
          width={44}
          height={44}
          className="size-11 object-contain"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-lg font-bold tracking-wide text-foreground">
          Jegue
        </span>
        <span className="file-stamp text-[0.62rem] text-primary">
          Investigações
        </span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 z-30 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <div className="px-2">
          <Logo />
        </div>
        <nav className="mt-10 flex flex-col gap-1.5">
          {nav.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'lamp-hover flex items-center gap-3 rounded-sm border border-transparent px-3 py-2.5 font-sans text-sm text-sidebar-foreground/80',
                  active &&
                    'border-primary/40 bg-sidebar-accent text-primary shadow-[inset_3px_0_0_0_var(--primary)]',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="size-4.5 shrink-0" aria-hidden="true" />
                <span className="font-medium tracking-wide">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto rounded-sm border border-sidebar-border/60 bg-sidebar-accent/40 p-3">
          <p className="file-stamp text-[0.6rem] text-primary/80">
            Arquivo Central
          </p>
          <p className="mt-1 font-serif text-xs text-sidebar-foreground/70 leading-relaxed">
            {'"A verdade repousa nos detalhes esquecidos."'}
          </p>
        </div>
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
