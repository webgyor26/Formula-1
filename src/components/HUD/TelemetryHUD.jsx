import { motion } from 'framer-motion'
import useSceneStore from '../../store/useSceneStore'
import GForceIndicator from './GForceIndicator'

export default function TelemetryHUD() {
  const { activeSection, rpm, speed, gear, gForce } = useSceneStore()
  const visible = activeSection >= 2 && activeSection <= 7

  const rpmPct = rpm / 15000
  const rpmColor = rpmPct < 0.6 ? '#00FF88' : rpmPct < 0.82 ? '#FFD700' : '#E8002D'

  return (
    <motion.div
      className="hud-overlay"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Left panel */}
      <div className="hud-panel hud-panel-left glass" style={{ borderColor: 'rgba(0,212,255,0.12)' }}>
        <div className="hud-label">SPEED</div>
        <div className="hud-value">{Math.round(speed).toString().padStart(3, '0')}</div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '8px',
          letterSpacing: '0.35em',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: '14px',
        }}>KM/H</div>

        <div className="hud-label">ENGINE RPM</div>
        <div className="hud-value" style={{ fontSize: '22px', color: rpmColor, fontFamily: "'Bebas Neue',sans-serif" }}>
          {Math.round(rpm).toLocaleString()}
        </div>
        <div className="hud-bar-container">
          <div className="hud-bar-fill" style={{
            width: `${rpmPct * 100}%`,
            background: rpmColor,
            boxShadow: `0 0 6px ${rpmColor}`,
          }} />
        </div>

        <div style={{ display: 'flex', gap: '5px', marginTop: '14px', alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: '28px',
              height: '3px',
              background: i === 0 ? '#FFD700' : i === 1 ? '#00FF88' : 'rgba(255,255,255,0.15)',
              boxShadow: i < 2 ? `0 0 5px ${i === 0 ? '#FFD700' : '#00FF88'}` : 'none',
            }} />
          ))}
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '7px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.25)',
            marginLeft: '6px',
          }}>SECTOR</span>
        </div>
      </div>

      {/* Center: gear */}
      <div className="hud-gear-display">
        <div className="gear-number">{gear}</div>
        <div className="gear-label">GEAR</div>
      </div>

      {/* Bottom RPM bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '3px',
        background: 'rgba(255,255,255,0.05)',
      }}>
        <motion.div
          style={{
            height: '100%',
            background: rpmColor,
            boxShadow: `0 0 8px ${rpmColor}`,
          }}
          animate={{ width: `${rpmPct * 100}%` }}
          transition={{ duration: 0.06 }}
        />
      </div>

      {/* Right panel */}
      <div className="hud-panel hud-panel-right glass" style={{ borderColor: 'rgba(0,212,255,0.12)' }}>
        <div className="hud-label">LAP TIME</div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '18px',
          color: '#F5F5F5',
          letterSpacing: '0.05em',
          marginBottom: '14px',
        }}>
          1:{Math.floor(20 + (1 - rpmPct) * 10).toString().padStart(2,'0')}.
          {Math.round(rpmPct * 999).toString().padStart(3,'0')}
        </div>

        <div className="hud-label">G-FORCE</div>
        <div className="hud-value green" style={{ fontSize: '30px' }}>
          {Math.abs(gForce).toFixed(1)}G
        </div>

        <div style={{ marginTop: '14px' }}>
          <div className="hud-label">THROTTLE</div>
          <div className="hud-bar-container">
            <motion.div
              className="hud-bar-fill"
              animate={{ width: `${Math.min(100, rpmPct * 118)}%` }}
              style={{ background: '#00FF88', boxShadow: '0 0 5px #00FF88' }}
              transition={{ duration: 0.06 }}
            />
          </div>
          <div className="hud-label" style={{ marginTop: '8px' }}>BRAKE</div>
          <div className="hud-bar-container">
            <motion.div
              className="hud-bar-fill"
              animate={{ width: `${Math.max(0, (0.25 - rpmPct) * 200)}%` }}
              style={{ background: '#E8002D', boxShadow: '0 0 5px #E8002D' }}
              transition={{ duration: 0.06 }}
            />
          </div>
        </div>
      </div>

      <GForceIndicator gForce={gForce} />
    </motion.div>
  )
}
