import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'

export default function Loader() {
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(true)
  const setIsLoaded = useSceneStore((s) => s.setIsLoaded)

  useEffect(() => {
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 14 + 4
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setShow(false)
          setIsLoaded(true)
        }, 500)
      }
      setProgress(Math.min(100, p))
    }, 70)
    return () => clearInterval(interval)
  }, [setIsLoaded])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="loader-overlay"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Scan line */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0, right: 0,
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(232,0,45,0.6), transparent)',
              pointerEvents: 'none',
            }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.5em',
              color: '#E8002D',
              textTransform: 'uppercase',
              marginBottom: '32px',
              animation: 'flicker 3s infinite',
            }}>
              INITIALIZING SYSTEMS
            </div>

            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(56px, 10vw, 88px)',
              lineHeight: 0.85,
              letterSpacing: '0.05em',
              marginBottom: '4px',
            }}>
              INTO THE <span style={{ color: '#E8002D', textShadow: '0 0 40px rgba(232,0,45,0.8)' }}>RED</span>
            </div>

            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.2)',
              marginBottom: '48px',
            }}>
              FORMULA 1 EXPERIENCE
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ width: '280px' }}
          >
            <div className="loader-bar-container">
              <div className="loader-bar" style={{ width: `${progress}%` }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
            }}>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.25)',
              }}>LOADING EXPERIENCE</span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '18px',
                color: '#E8002D',
                letterSpacing: '0.1em',
              }}>
                {Math.round(progress).toString().padStart(3, '0')}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
