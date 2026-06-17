import { motion } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'
import { clamp01 } from '../hooks/useScrollProgress'

export default function AssemblySection() {
  const s = useSceneStore((x) => x.scrollProgress)
  const activeSection = useSceneStore((x) => x.activeSection)
  const visible = activeSection === 7
  const assembleT = clamp01(s, 0.85, 0.93)

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* White flash at peak assembly */}
      {assembleT > 0.9 && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'white',
            pointerEvents: 'none',
          }}
          initial={{ opacity: assembleT > 0.95 ? 0.6 : 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      )}

      <div style={{ textAlign: 'center' }}>
        <motion.div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.5em',
            color: '#00FF88',
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ◉ SYSTEM REASSEMBLY COMPLETE
        </motion.div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(56px, 10vw, 140px)',
          lineHeight: 0.88,
          color: '#F5F5F5',
          transform: `scale(${0.85 + assembleT * 0.15})`,
          transition: 'transform 0.1s',
        }}>
          REBORN<br />
          <span style={{ color: '#E8002D', textShadow: '0 0 60px rgba(232,0,45,0.6)' }}>
            FROM CARBON
          </span>
        </div>
      </div>
    </motion.div>
  )
}
