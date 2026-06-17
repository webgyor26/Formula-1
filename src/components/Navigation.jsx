import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useSceneStore from '../store/useSceneStore'

const SECTIONS = ['Emergence', 'Systems', 'Tunnel', 'Velocity', 'Race', 'Anatomy', 'Legend']

export default function Navigation() {
  const isLoaded = useSceneStore((s) => s.isLoaded)
  const scrollProgress = useSceneStore((s) => s.scrollProgress)
  const activeSection = useSceneStore((s) => s.activeSection)

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-logo">
          F1<span>X</span>
        </div>
        <ul className="nav-links">
          {['Performance', 'Technology'].map((item) => (
            <li key={item}><a href="#">{item}</a></li>
          ))}
          <li key="Experience"><Link to="/experience">Experience</Link></li>
        </ul>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#E8002D',
          minWidth: '40px',
        }}>
          {String(Math.round(scrollProgress * 100)).padStart(3, '0')}
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px' }}>%</span>
        </div>
      </motion.nav>

      {/* Section dots indicator */}
      <motion.div
        className="section-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1 }}
      >
        {SECTIONS.map((_, i) => (
          <div
            key={i}
            className={`section-dot ${activeSection === i + 1 ? 'active' : ''}`}
          />
        ))}
      </motion.div>
    </>
  )
}
