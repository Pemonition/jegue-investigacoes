export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="file-stamp mb-2 text-xs text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 font-sans text-sm text-muted-foreground leading-relaxed text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="flex items-center gap-3">{children}</div> : null}
    </div>
  )
}
