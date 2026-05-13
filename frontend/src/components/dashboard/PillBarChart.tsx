'use client'

import { useState } from 'react'

export interface BarDatum {
  label: string
  value: number
  filled: boolean
}

const STRIPE_ID = 'pillStripe'

export function PillBarChart({ data, stripeId = STRIPE_ID }: {
  data: BarDatum[]
  stripeId?: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (!data.length) {
    return (
      <div className="h-36 flex items-center justify-center text-slate-200 text-sm">
        Aucune donnée
      </div>
    )
  }

  const max = Math.max(...data.map(d => d.value), 1)
  const BAR_W = 26, GAP = 12, H = 148
  const chartW = data.length * (BAR_W + GAP) - GAP + 40

  const peakIdx = data.reduce(
    (best, d, i) => (d.filled && d.value > (data[best]?.value ?? 0) ? i : best),
    0,
  )

  return (
    <svg viewBox={`0 0 ${chartW} ${H + 26}`} className="w-full" style={{ minHeight: 150 }}>
      <defs>
        <pattern id={stripeId} x="0" y="0" width="6" height="6"
          patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="6" height="6" fill="#f8fafc" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="#e2e8f0" strokeWidth="2.5" />
        </pattern>
      </defs>

      {data.map((d, i) => {
        const x = 20 + i * (BAR_W + GAP)
        const bH = Math.max(BAR_W, (d.value / max) * H)
        const active = hovered === i
        const isPeak = i === peakIdx && d.filled
        const fill = d.filled ? (active ? '#f97316' : '#7c3aed') : `url(#${stripeId})`

        return (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>

            {isPeak && (
              <g>
                <rect x={x - 6} y={H - bH - 24} width={BAR_W + 12} height={18}
                  rx={9} fill="#7c3aed" />
                <text x={x + BAR_W / 2} y={H - bH - 11}
                  textAnchor="middle" fontSize={9} fill="white" fontWeight="700">
                  {Math.round(d.value)}
                </text>
              </g>
            )}

            <rect
              x={x} y={H - bH} width={BAR_W} height={bH}
              rx={BAR_W / 2} ry={BAR_W / 2}
              fill={fill}
              stroke={d.filled ? 'none' : '#ddd6fe'}
              strokeWidth={1.5}
              opacity={hovered !== null && !active && d.filled ? 0.5 : 1}
            />

            {active && d.filled && !isPeak && (
              <text x={x + BAR_W / 2} y={H - bH - 6}
                textAnchor="middle" fontSize={9} fill="#f97316" fontWeight="700">
                {Math.round(d.value)}
              </text>
            )}

            <text x={x + BAR_W / 2} y={H + 18}
              textAnchor="middle" fontSize={9} fill="#94a3b8">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
