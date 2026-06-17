import useSceneStore from '../store/useSceneStore'
import { clamp01 } from '../hooks/useScrollProgress'

export default function EmergenceSection() {
  const s = useSceneStore((x) => x.scrollProgress)
  const inT  = clamp01(s, 0.10, 0.20)
  const outT = clamp01(s, 0.24, 0.32)
  const opacity = inT * (1 - outT)

  return (
    <div style={{
      position: 'fixed',
      bottom: '14vh',
      left: '8vw',
      zIndex: 20,
      opacity,
      pointerEvents: 'none',
    }}>
      {['THE', 'MACHINE', 'AWAKENS'].map((word, i) => (
        <div key={word} style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(38px, 7vw, 96px)',
          lineHeight: 0.84,
          color: i === 1 ? '#E8002D' : '#F5F5F5',
          textShadow: i === 1 ? '0 0 60px rgba(232,0,45,0.55)' : 'none',
          transform: `translateX(${(1 - inT) * (40 + i * 18)}px)`,
          transition: `transform ${0.55 + i * 0.1}s cubic-bezier(0.16,1,0.3,1)`,
        }}>
          {word}
        </div>
      ))}
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.4em',
        color: 'rgba(255,255,255,0.28)',
        textTransform: 'uppercase',
        marginTop: '14px',
        transform: `translateX(${(1 - inT) * 60}px)`,
        transition: 'transform 0.85s cubic-bezier(0.16,1,0.3,1)',
      }}>
        1.6L V6 Turbo Hybrid · 1,000+ BHP
      </div>
    </div>
  )
}
