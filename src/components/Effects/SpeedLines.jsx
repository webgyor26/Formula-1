import { useEffect, useRef } from 'react'
import useSceneStore from '../../store/useSceneStore'
import { clamp01 } from '../../hooks/useScrollProgress'

export default function SpeedLines() {
  const canvasRef = useRef(null)
  const linesRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = 140
    linesRef.current = Array.from({ length: COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 0.55 + 0.2,
      len: Math.random() * 0.09 + 0.02,
      speed: Math.random() * 0.02 + 0.01,
      opacity: Math.random() * 0.5 + 0.3,
      life: Math.random(),
    }))

    const draw = () => {
      const { scrollProgress } = useSceneStore.getState()
      const tunnelT = clamp01(scrollProgress, 0.40, 0.50)
      const exitT = clamp01(scrollProgress, 0.68, 0.76)
      const raceT = clamp01(scrollProgress, 0.65, 0.70)
      const intensity = Math.max(tunnelT, raceT) * (1 - exitT)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (intensity < 0.01) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const maxDim = Math.max(canvas.width, canvas.height)

      for (const line of linesRef.current) {
        line.life += line.speed * intensity * 2.5
        if (line.life > 1) {
          line.life = 0
          line.angle = Math.random() * Math.PI * 2
          line.opacity = Math.random() * 0.5 + 0.25
        }

        const r = line.dist * maxDim * line.life
        const x1 = cx + Math.cos(line.angle) * r
        const y1 = cy + Math.sin(line.angle) * r
        const lenPx = line.len * maxDim * intensity
        const x2 = x1 + Math.cos(line.angle) * lenPx
        const y2 = y1 + Math.sin(line.angle) * lenPx

        const grad = ctx.createLinearGradient(x1, y1, x2, y2)
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(0.5, `rgba(255,255,255,${line.opacity * intensity * 0.55})`)
        grad.addColorStop(1, `rgba(232,0,45,0)`)

        ctx.beginPath()
        ctx.strokeStyle = grad
        ctx.lineWidth = Math.random() * 1.2 + 0.4
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="speed-lines-canvas" />
}
