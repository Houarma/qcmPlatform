// Server Component — no interactivity needed, pure SVG render

interface GaugeChartProps {
  value: number   // 0-100
  label: string
  legend?: { color: string; label: string }[]
}

export function GaugeChart({ value, label, legend }: GaugeChartProps) {
  const R = 54, cx = 80, cy = 72, sw = 13
  const circ = Math.PI * R
  const dash = Math.min(1, Math.max(0, value / 100)) * circ

  return (
    <div>
      <svg viewBox="0 0 160 90" className="w-full max-w-48 mx-auto">
        {/* Track */}
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round" />
        {/* Fill */}
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none" stroke="#7c3aed" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`} />
        <text x={cx} y={cy - 10} textAnchor="middle"
          fontSize="21" fontWeight="800" fill="#1e293b">
          {Math.round(value)}%
        </text>
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="8" fill="#94a3b8">
          {label}
        </text>
      </svg>

      {legend && (
        <div className="flex items-center justify-center gap-3 -mt-1 flex-wrap">
          {legend.map(l => (
            <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
