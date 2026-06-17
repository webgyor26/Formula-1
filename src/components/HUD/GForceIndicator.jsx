import { useEffect, useRef } from 'react'

export default function GForceIndicator({ gForce }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const S = 80
    canvas.width = S
    canvas.height = S
    const cx = S / 2
    const cy = S / 2
    const r = S / 2 - 5

    ctx.clearRect(0, 0, S, S)

    // Rings
    for (const f of [0.33, 0.66, 1]) {
      ctx.beginPath()
      ctx.arc(cx, cy, r * f, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,212,255,${f === 1 ? 0.2 : 0.1})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Cross
    ctx.strokeStyle = 'rgba(0,212,255,0.12)'
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(cx, 4); ctx.lineTo(cx, S - 4); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(4, cy); ctx.lineTo(S - 4, cy); ctx.stroke()

    // Dot
    const maxG = 5
    const dy = (gForce / maxG) * r * 0.9
    const dotX = cx
    const dotY = cy - dy

    const grd = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 9)
    grd.addColorStop(0, 'rgba(0,255,136,0.85)')
    grd.addColorStop(1, 'rgba(0,255,136,0)')
    ctx.beginPath()
    ctx.arc(dotX, dotY, 9, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()

    ctx.beginPath()
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#00FF88'
    ctx.fill()
  }, [gForce])

  return (
    <div style={{
      position: 'absolute',
      bottom: '120px',
      right: '48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
    }}>
      <canvas ref={canvasRef} style={{ width: 80, height: 80 }} />
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '8px',
        letterSpacing: '0.25em',
        color: 'rgba(0,212,255,0.45)',
        textTransform: 'uppercase',
      }}>G-Force</div>
    </div>
  )
}
