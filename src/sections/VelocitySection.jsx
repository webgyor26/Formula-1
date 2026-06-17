import { motion } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'

export default function VelocitySection() {
  const activeSection = useSceneStore((s) => s.activeSection)
  const speed = useSceneStore((s) => s.speed)
  const visible = activeSection === 4

  const color = speed < 150 ? '#F5F5F5' : speed < 280 ? '#FFD700' : '#E8002D'

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '38%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        textAlign: 'center',
        pointerEvents: 'none',
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '9px',
        letterSpacing: '0.55em',
        color: 'rgba(255,255,255,0.28)',
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        Peak Velocity
      </div>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(96px, 17vw, 255px)',
        lineHeight: 0.82,
        color,
        textShadow: speed > 300 ? `0 0 80px ${color}` : 'none',
        transition: 'color 0.2s, text-shadow 0.2s',
        letterSpacing: '-0.025em',
      }}>
        {Math.round(speed)}
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '12px',
        letterSpacing: '0.65em',
        color: 'rgba(255,255,255,0.28)',
        marginTop: '6px',
      }}>
        KM / H
      </div>

      {speed >= 348 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '20px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.35em',
            color: '#E8002D',
            textTransform: 'uppercase',
          }}
        >
          ▲ TOP SPEED ACHIEVED ▲
        </motion.div>
      )}
    </motion.div>
  )
}
