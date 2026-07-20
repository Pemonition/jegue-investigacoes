'use client'

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

type Datum = { label: string; value: number }

function VintageTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="parchment rounded-sm border border-primary/40 px-3 py-2 shadow-lg">
      <p className="font-serif text-sm font-semibold">{p.payload.label}</p>
      <p className="file-stamp text-xs">{p.value}</p>
    </div>
  )
}

// Barras horizontais (rankings)
export function HorizontalBars({
  data,
  color = 'var(--chart-1)',
  height,
}: {
  data: Datum[]
  color?: string
  height?: number
}) {
  const h = height ?? Math.max(160, data.length * 42)
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
        barCategoryGap={10}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={130}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.3 }} content={<VintageTooltip />} />
        <Bar dataKey="value" fill={color} radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Barras verticais
export function VerticalBars({
  data,
  color = 'var(--chart-1)',
  height = 240,
}: {
  data: Datum[]
  color?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 4, left: -16 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          interval={0}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.3 }} content={<VintageTooltip />} />
        <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Rosca / pizza
export function DonutChart({
  data,
  height = 240,
}: {
  data: Datum[]
  height?: number
}) {
  const radius = Math.floor(height / 2) - 10
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip content={<VintageTooltip />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={Math.floor(radius * 0.58)}
          outerRadius={radius}
          paddingAngle={2}
          stroke="var(--background)"
          strokeWidth={2}
          isAnimationActive={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ChartLegend({ data }: { data: Datum[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {data.map((d, i) => (
        <li key={d.label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="size-3 rounded-[2px]"
            style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
          />
          <span className="font-sans">
            {d.label} <span className="text-foreground/70">({d.value})</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
