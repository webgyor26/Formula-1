import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import useSceneStore from '../../store/useSceneStore'

function drawSpeedometer(canvas, speed) {
  const ctx = canvas.getContext('2d')
  const S = canvas.width
  const cx = S / 2, cy = S / 2
  const r = S / 2 - 24
  const START = Math.PI * 0.75
  const END = Math.PI * 2.25
  const RANGE = END - START
  const frac = speed / 350

  ctx.clearRect(0, 0, S, S)

  // Background track
  ctx.beginPath()
  ctx.arc(cx, cy, r, START, END)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 3
  ctx.stroke()

  // Colored arc
  if (frac > 0.002) {
    const color = frac < 0.5 ? '#00D4FF' : frac < 0.8 ? '#FFD700' : '#E8002D'
    ctx.beginPath()
    ctx.arc(cx, cy, r, START, START + RANGE * frac)
    ctx.strokeStyle = color
    ctx.lineWidth = 5
    ctx.shadowBlur = 25
    ctx.shadowColor = color
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // Tick marks
  for (let i = 0; i <= 35; i++) {
    const angle = START + (i / 35) * RANGE
    const major = i % 5 === 0
    const r1 = r, r2 = r - (major ? 18 : 8)
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1)
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2)
    ctx.strokeStyle = major ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)'
    ctx.lineWidth = major ? 2 : 1
    ctx.shadowBlur = 0
    ctx.stroke()

    if (major) {
      const lr = r2 - 16
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = `${S * 0.028}px 'Space Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((i * 10).toString(), cx + Math.cos(angle) * lr, cy + Math.sin(angle) * lr)
    }
  }

  // Needle
  const na = START + RANGE * frac
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(na)
  ctx.beginPath()
  ctx.moveTo(-r * 0.12, 0)
  ctx.lineTo(r * 0.84, 0)
  ctx.strokeStyle = '#E8002D'
  ctx.lineWidth = 2.5
  ctx.shadowBlur = 18
  ctx.shadowColor = '#E8002D'
  ctx.stroke()
  ctx.shadowBlur = 0
  ctx.restore()

  // Center cap
  const cap = ctx.createRadialGradient(cx, cy, 0, cx, cy, 11)
  cap.addColorStop(0, '#E8002D')
  cap.addColorStop(1, '#7a0015')
  ctx.beginPath()
  ctx.arc(cx, cy, 10, 0, Math.PI * 2)
  ctx.fillStyle = cap
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
}

export default function Speedometer() {
  const canvasRef = useRef(null)
  const { speed, activeSection } = useSceneStore()
  const visible = activeSection === 4

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const S = Math.min(window.innerWidth * 0.65, 580)
    canvas.width = S
    canvas.height = S
    drawSpeedometer(canvas, speed)
  }, [speed])

  const speedColor = speed < 150 ? '#F5F5F5' : speed < 280 ? '#FFD700' : '#E8002D'

  return (
    <motion.div
      className="speedometer-overlay"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
        <div style={{
          position: 'absolute',
          textAlign: 'center',
          top: '44%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}>
          <span
            className={`speed-number${speed > 280 ? ' fast' : speed > 150 ? ' mid' : ''}`}
            style={{ color: speedColor, transition: 'color 0.15s' }}
          >
            {Math.round(speed)}
          </span>
          <span className="speed-unit">KM / H</span>
          {speed >= 348 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.35em',
                color: '#E8002D',
                marginTop: '12px',
                textTransform: 'uppercase',
              }}
            >
              ▲ TOP SPEED
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
