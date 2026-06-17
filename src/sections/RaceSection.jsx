import { motion } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'
import { clamp01 } from '../hooks/useScrollProgress'

export default function RaceSection() {
  const s = useSceneStore((x) => x.scrollProgress)
  const activeSection = useSceneStore((x) => x.activeSection)
  const visible = activeSection === 5
  const raceT = clamp01(s, 0.65, 0.75)

  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 25, pointerEvents: 'none' }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Position — top right */}
      <div style={{ position: 'absolute', top: '80px', right: '52px', textAlign: 'right' }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.4em',
          color: 'rgba(255,255,255,0.28)',
          marginBottom: '4px',
        }}>POSITION</div>
        <div className="race-position">P1</div>
        <div className="race-pos-label">RACE LEADER</div>
      </div>

      {/* Track info — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '15vh',
        left: '8vw',
        transform: `translateX(${(1 - raceT) * -80}px)`,
        transition: 'transform 0.5s ease',
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.4em',
          color: '#E8002D',
          marginBottom: '8px',
        }}>CIRCUIT DE LA PERFORMANCE</div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(48px, 8.5vw, 110px)',
          lineHeight: 0.84,
          color: '#F5F5F5',
        }}>
          LAP 43<br />
          <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.48em' }}>OF 57</span>
        </div>
      </div>

      {/* DRS activated flash */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 1, 0.92] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5 }}
      >
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.4em',
          color: '#00D4FF',
          border: '1px solid rgba(0,212,255,0.35)',
          padding: '7px 18px',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(12px)',
          textTransform: 'uppercase',
          boxShadow: '0 0 20px rgba(0,212,255,0.15)',
        }}>
          ▶ DRS ACTIVATED
        </div>
      </motion.div>

      {/* Lap progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          style={{ height: '100%', background: 'linear-gradient(to right, #00FF88, #00D4FF)', boxShadow: '0 0 8px #00FF88' }}
          animate={{ width: `${raceT * 100}%` }}
          transition={{ duration: 0.06 }}
        />
      </div>
    </motion.div>
  )
}
