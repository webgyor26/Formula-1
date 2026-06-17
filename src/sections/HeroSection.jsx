import { motion } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'

export default function HeroSection() {
  const activeSection = useSceneStore((s) => s.activeSection)
  const visible = activeSection >= 8

  return (
    <motion.div
      className="hero-cta-overlay"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="hero-cta-content">
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.5em',
          color: 'rgba(255,255,255,0.28)',
          marginBottom: '16px',
          textTransform: 'uppercase',
        }}>
          Formula 1 · 2024 Season
        </div>
        <div className="hero-cta-title">
          ENGINEERED FOR<br />
          <span style={{ color: '#E8002D', textShadow: '0 0 60px rgba(232,0,45,0.5)' }}>ETERNITY</span>
        </div>
        <button className="hero-cta-button" type="button">
          <span>Experience The Drive</span>
        </button>
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '28px',
          justifyContent: 'center',
        }}>
          {['Instagram', 'Twitter', 'YouTube'].map((soc) => (
            <span key={soc} style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.color = '#F5F5F5'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.2)'}
            >
              {soc}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
