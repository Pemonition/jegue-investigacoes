import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Zilla_Slab, Special_Elite } from 'next/font/google'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const zillaSlab = Zilla_Slab({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

const specialElite = Special_Elite({
  subsets: ['latin'],
  variable: '--font-stamp',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Jegue Investigações — Casos Não Resolvidos',
  description:
    'Agência de investigação criminal Jegue Investigações. Gerenciamento de crimes não resolvidos, evidências, suspeitos e relatórios.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#2a2016',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark bg-background ${playfair.variable} ${zillaSlab.variable} ${specialElite.variable}`}
    >
      <body className="font-sans antialiased">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
