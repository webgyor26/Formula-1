import { useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ExperienceCanvas from '../experience/ExperienceCanvas'
import ExperienceHUD from '../experience/ExperienceHUD'
import useExperienceStore from '../experience/useExperienceStore'

function SpeedLinesCanvas() {
  const canvasRef = useRef()
  const linesRef = useRef([])
  const animRef = useRef()

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

    const LINE_COUNT = 80
    linesRef.current = Array.from({ length: LINE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: Math.random() * 200 + 40,
      speed: Math.random() * 18 + 6,
      opacity: Math.random() * 0.4 + 0.05,
      width: Math.random() * 1.2 + 0.3,
    }))

    const draw = () => {
      const s = useExperienceStore.getState().scrollProgress
      const racingIntensity = Math.max(0, Math.min(1, (s - 0.60) / 0.20))
      const revealIntensity = Math.max(0, Math.min(1, (s - 0.38) / 0.05)) * Math.max(0, 1 - (s - 0.43) / 0.05)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const intensity = Math.max(racingIntensity, revealIntensity * 0.3)
      if (intensity < 0.02) { animRef.current = requestAnimationFrame(draw); return }

      linesRef.current.forEach(line => {
        line.x -= line.speed * intensity * 2.5
        if (line.x + line.len < 0) {
          line.x = canvas.width + line.len
          line.y = Math.random() * canvas.height
        }

        const grad = ctx.createLinearGradient(line.x, line.y, line.x + line.len, line.y)
        grad.addColorStop(0, `rgba(255,255,255,0)`)
        grad.addColorStop(0.5, `rgba(255,255,255,${line.opacity * intensity})`)
        grad.addColorStop(1, `rgba(255,255,255,0)`)

        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x + line.len, line.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = line.width
        ctx.stroke()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 5,
        pointerEvents: 'none', mixBlendMode: 'screen',
      }}
    />
  )
}

export default function Experience() {
  const setScrollProgress = useExperienceStore((s) => s.setScrollProgress)
  const scrollProgress = useExperienceStore((s) => s.scrollProgress)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0
      setScrollProgress(Math.min(1, Math.max(0, progress)))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setScrollProgress])

  return (
    <div style={{ background: '#030303', minHeight: '800vh', position: 'relative' }}>
      {/* 3D canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ExperienceCanvas />
      </div>

      {/* Speed lines overlay */}
      <SpeedLinesCanvas />

      {/* Scanlines */}
      <div className="scanlines" style={{ zIndex: 6 }} />

      {/* Corner accents */}
      <div className="corner-accent corner-accent-tl" style={{ zIndex: 8 }} />
      <div className="corner-accent corner-accent-tr" style={{ zIndex: 8 }} />
      <div className="corner-accent corner-accent-bl" style={{ zIndex: 8 }} />
      <div className="corner-accent corner-accent-br" style={{ zIndex: 8 }} />

      {/* HUD overlays */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
        <ExperienceHUD />
      </div>

      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress * 100}%`, zIndex: 30 }}
      />

      {/* Nav bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 25, padding: '24px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'all',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '28px', letterSpacing: '0.15em', color: '#F5F5F5',
        }}>
          F1<span style={{ color: '#E8002D' }}>X</span>
        </div>
        <Link to="/" style={{
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          textDecoration: 'none',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
          border: '1px solid rgba(232,0,45,0.4)',
          padding: '8px 20px',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F5F5F5'; e.currentTarget.style.borderColor = '#E8002D' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(232,0,45,0.4)' }}
        >
          ← Home
        </Link>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px', letterSpacing: '0.15em', color: '#E8002D',
        }}>
          {String(Math.round(scrollProgress * 100)).padStart(3, '0')}
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px' }}>%</span>
        </div>
      </div>
    </div>
  )
}
