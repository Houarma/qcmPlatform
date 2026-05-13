'use client'

import Image from 'next/image'

// ─── Orbital icon data ────────────────────────────────────────────────────────
// ring 0 = inner (80px), ring 1 = middle (140px), ring 2 = outer (200px)
// startAngle: initial angle in degrees (0 = top, clockwise)
// duration: seconds per full revolution
// animDelay: -(startAngle / 360) * duration  → positions icon at startAngle initially

const ICONS = [
  // Inner ring — 2 icons — 12s revolution
  { label: 'FB',  bg: 'bg-orange-500',  text: '🔥', ring: 0, startAngle:  60, duration: 12 },
  { label: 'SB',  bg: 'bg-green-500',   text: '🌿', ring: 0, startAngle: 240, duration: 12 },
  // Middle ring — 3 icons — 18s revolution
  { label: 'NX',  bg: 'bg-slate-800',   text: '▲',  ring: 1, startAngle:  30, duration: 18 },
  { label: 'FA',  bg: 'bg-teal-500',    text: '⚡', ring: 1, startAngle: 150, duration: 18 },
  { label: 'PG',  bg: 'bg-blue-700',    text: '🐘', ring: 1, startAngle: 270, duration: 18 },
  // Outer ring — 3 icons — 26s revolution
  { label: 'AI',  bg: 'bg-violet-600',  text: '🧠', ring: 2, startAngle:  80, duration: 26 },
  { label: 'DK',  bg: 'bg-sky-500',     text: '🐋', ring: 2, startAngle: 200, duration: 26 },
  { label: 'RC',  bg: 'bg-cyan-400',    text: '⚛️', ring: 2, startAngle: 320, duration: 26 },
]

const RING_RADIUS = [80, 140, 200] as const
const RING_ANIM   = ['orbit-80', 'orbit-140', 'orbit-200'] as const

// Dots for decoration
const DOTS = [
  { x: 45,  y: 155, size: 6, opacity: 0.4 },
  { x: 255, y: 175, size: 4, opacity: 0.3 },
  { x: 140, y: 30,  size: 5, opacity: 0.35 },
  { x: 90,  y: 290, size: 4, opacity: 0.25 },
  { x: 210, y: 310, size: 5, opacity: 0.3 },
]

export default function AuthVisual() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between py-10 px-8 select-none">
      {/* Title */}
      <div className="text-center z-10">
        <h2 className="text-2xl font-bold text-slate-800 leading-snug">
          Évaluez Plus
          <span className="text-blue-600"> Intelligemment</span>
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
          Plateforme académique propulsée par l'IA pour créer, distribuer et analyser vos QCM
        </p>
      </div>

      {/* Orbital zone */}
      <div className="relative flex items-center justify-center" style={{ width: 440, height: 440 }}>
        {/* Scatter dots */}
        {DOTS.map((d, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-400"
            style={{ width: d.size, height: d.size, left: d.x, top: d.y, opacity: d.opacity }}
          />
        ))}

        {/* Ring circles (decorative) */}
        {RING_RADIUS.map((r, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-blue-300/40"
            style={{ width: r * 2, height: r * 2, top: '50%', left: '50%', marginTop: -r, marginLeft: -r }}
          />
        ))}

        {/* Orbiting icons */}
        {ICONS.map((icon, i) => {
          const delay = -((icon.startAngle / 360) * icon.duration)
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                marginTop: -22,
                marginLeft: -22,
                animation: `${RING_ANIM[icon.ring]} ${icon.duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            >
              <div className={`w-11 h-11 rounded-full ${icon.bg} flex items-center justify-center shadow-lg text-lg`}>
                {icon.text}
              </div>
            </div>
          )
        })}

        {/* Central icon */}
        <div className="absolute w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl z-10"
          style={{ top: '50%', left: '50%', marginTop: -40, marginLeft: -40 }}>
          <Image src="/logo.png" alt="QCMPlatform" width={64} height={64} className="rounded-full" />
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center z-10">
        <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
          Intègre <strong className="text-slate-700">Firebase, Spring Boot, FastAPI</strong> et{' '}
          <strong className="text-slate-700">Groq AI</strong> pour une expérience d'évaluation moderne.
        </p>
        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="w-7 h-2 rounded-full bg-blue-600" />
          <div className="w-2 h-2 rounded-full bg-blue-300" />
          <div className="w-2 h-2 rounded-full bg-blue-300" />
        </div>
      </div>
    </div>
  )
}
