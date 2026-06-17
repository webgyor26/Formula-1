import { motion } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'

const STATS = [
  { number: '1,600', label: 'Individual Components' },
  { number: '1,000+', label: 'Brake Horsepower' },
  { number: '1.6L', label: 'V6 Turbo Hybrid Engine' },
  { number: '798kg', label: 'Total Car Weight' },
]

export default function AnatomySection() {
  const activeSection = useSceneStore((s) => s.activeSection)
  const visible = activeSection === 6

  return (
    <motion.div
      className="anatomy-overlay"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="glass" style={{
        padding: '32px 28px',
        borderColor: 'rgba(232,0,45,0.12)',
        maxWidth: '300px',
        borderRadius: '2px',
      }}>
        <div className="anatomy-title">
          ANATOMY OF<br />
          <span style={{ color: '#E8002D' }}>SPEED</span>
        </div>

        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="anatomy-stat"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -18 }}
            transition={{ delay: visible ? i * 0.09 : 0, duration: 0.4 }}
          >
            <div className="anatomy-stat-number">{stat.number}</div>
            <div className="anatomy-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
