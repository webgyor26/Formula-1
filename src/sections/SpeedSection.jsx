import useSceneStore from '../store/useSceneStore'
import { clamp01 } from '../hooks/useScrollProgress'

export default function SpeedSection() {
  const s = useSceneStore((x) => x.scrollProgress)
  const rpm = useSceneStore((x) => x.rpm)
  const inT  = clamp01(s, 0.27, 0.36)
  const outT = clamp01(s, 0.38, 0.46)
  const opacity = inT * (1 - outT)

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '8vw',
      transform: `translateY(-50%) translateX(${(1 - inT) * 70}px)`,
      zIndex: 20,
      opacity,
      pointerEvents: 'none',
      textAlign: 'right',
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.45em',
        color: '#E8002D',
        marginBottom: '10px',
        textTransform: 'uppercase',
      }}>
        ◉ ALL SYSTEMS OPERATIONAL
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(48px, 8.5vw, 118px)',
        lineHeight: 0.84,
        color: '#F5F5F5',
      }}>
        {Math.round(rpm).toLocaleString()}<br />
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.42em', letterSpacing: '0.05em' }}>
          REVOLUTIONS<br />PER MINUTE
        </span>
      </div>
      <div style={{
        marginTop: '16px',
        height: '2px',
        background: 'linear-gradient(to left, #E8002D, transparent)',
        transform: `scaleX(${inT})`,
        transformOrigin: 'right',
        boxShadow: '0 0 12px #E8002D',
        transition: 'transform 0.1s',
      }} />
    </div>
  )
}
