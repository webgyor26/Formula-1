import useSceneStore from '../store/useSceneStore'
import { clamp01 } from '../hooks/useScrollProgress'

export default function TunnelSection() {
  const s = useSceneStore((x) => x.scrollProgress)
  const inT  = clamp01(s, 0.40, 0.48)
  const outT = clamp01(s, 0.53, 0.58)
  const midT = clamp01(s, 0.44, 0.53)
  const opacity = inT * (1 - outT)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 20,
      opacity,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: '14vh',
    }}>
      {/* Warning stripe — top */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '5px',
        background: 'repeating-linear-gradient(to right, #FFD700 0px, #FFD700 18px, #111 18px, #111 36px)',
        opacity: midT * 0.7,
      }} />
      {/* Warning stripe — bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '5px',
        background: 'repeating-linear-gradient(to right, #111 0px, #111 18px, #FFD700 18px, #FFD700 36px)',
        opacity: midT * 0.7,
      }} />

      <div style={{ textAlign: 'center', transform: `translateY(${(1 - inT) * 36}px)`, transition: 'transform 0.55s ease' }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.5em',
          color: '#FFD700',
          marginBottom: '10px',
          textTransform: 'uppercase',
        }}>
          ⚡ SECTOR 2 — TUNNEL COMPLEX
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(56px, 10vw, 148px)',
          lineHeight: 0.84,
          color: '#F5F5F5',
          textShadow: '0 0 60px rgba(255,255,255,0.15)',
        }}>
          ENTER THE<br />
          <span style={{ color: '#E8002D', textShadow: '0 0 80px rgba(232,0,45,0.85)' }}>
            DARKNESS
          </span>
        </div>
      </div>
    </div>
  )
}
