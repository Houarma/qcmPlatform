import { ImageResponse } from 'next/og'

export const alt = 'QCM Platform — Plateforme intelligente de QCM par IA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0e2a',
          padding: '60px',
        }}
      >
        {/* Glow background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          background: 'radial-gradient(ellipse at 50% 0%, #4f46e520 0%, transparent 70%)',
        }} />

        {/* Logo square */}
        <div style={{
          width: 110,
          height: 110,
          background: '#7c3aed',
          borderRadius: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 0 40px #7c3aed60',
        }}>
          <div style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1,
            display: 'flex',
          }}>Q</div>
        </div>

        {/* Title */}
        <div style={{
          color: '#ffffff',
          fontSize: 68,
          fontWeight: 800,
          letterSpacing: '-2px',
          marginBottom: 16,
          display: 'flex',
        }}>
          QCM Platform
        </div>

        {/* Subtitle */}
        <div style={{
          color: '#818cf8',
          fontSize: 26,
          marginBottom: 44,
          textAlign: 'center',
          maxWidth: 700,
          display: 'flex',
        }}>
          Créez des QCM avec l'IA · Analysez les résultats · Suivez la progression
        </div>

        {/* Tech pills */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['Next.js', 'Spring Boot', 'FastAPI', 'Groq AI', 'Firebase'].map(tag => (
            <div
              key={tag}
              style={{
                background: '#1e1b4b',
                border: '1px solid #4f46e5',
                borderRadius: 8,
                padding: '8px 18px',
                color: '#a5b4fc',
                fontSize: 18,
                display: 'flex',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
