import { motion, AnimatePresence } from 'framer-motion'
import useExperienceStore from './useExperienceStore'

const SECTIONS = [
  {
    range: [0, 0.20],
    label: '01 / MANUFACTURING',
    title: 'ENGINEERING\nPERFECTION',
    sub: 'Every component, precisely assembled',
  },
  {
    range: [0.20, 0.40],
    label: '02 / AWAKENING',
    title: 'FROM\nDARKNESS',
    sub: 'The machine comes to life',
  },
  {
    range: [0.40, 0.60],
    label: '03 / 360° SHOWCASE',
    title: 'INSPECT\nEVERY ANGLE',
    sub: 'Studio-quality examination',
  },
  {
    range: [0.60, 0.80],
    label: '04 / RACING MODE',
    title: 'FEEL THE\nSPEED',
    sub: 'Zero to 350 km/h in seconds',
  },
  {
    range: [0.80, 1.00],
    label: '05 / FULL THROTTLE',
    title: 'ENTER\nTHE GRID',
    sub: 'Championship begins now',
  },
]

const assemblyParts = [
  'CHASSIS', 'MONOCOQUE', 'FRONT WING', 'REAR WING', 'SUSPENSION',
  'WHEELS & TYRES', 'SIDEPODS', 'HALO', 'ENGINE COVER', 'LIVERY',
]

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}

function norm(v, lo, hi) {
  return clamp((v - lo) / (hi - lo), 0, 1)
}

export default function ExperienceHUD() {
  const s = useExperienceStore((st) => st.scrollProgress)

  const sectionIdx = SECTIONS.findIndex(({ range }) => s >= range[0] && s < range[1])
  const activeSectionIdx = sectionIdx === -1 ? 4 : sectionIdx
  const section = SECTIONS[activeSectionIdx]

  // Assembly part progress (section 1, 0-20%)
  const partsVisible = assemblyParts.map((_, i) => {
    const start = (i / assemblyParts.length) * 0.20
    const end = start + 0.04
    return norm(s, start, end)
  })
  const assembledCount = partsVisible.filter(v => v > 0.5).length
  const totalAssembled = assemblyParts.length
  const assemblyPct = Math.round((assembledCount / totalAssembled) * 100)

  // Reveal percentage (section 2, 20-40%)
  const revealPct = Math.round(norm(s, 0.20, 0.40) * 100)

  // Rotation degrees (section 3, 40-60%)
  const rotDeg = Math.round(norm(s, 0.40, 0.60) * 360)

  // Speed (section 4, 60-80%)
  const raceSpeed = Math.round(norm(s, 0.60, 0.80) * 348)

  const inSection = (lo, hi) => s >= lo && s < hi

  return (
    <>
      {/* Section label top-left */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSectionIdx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: '80px',
            left: '48px',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.35em',
            color: '#E8002D',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            {section.label}
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(28px, 4vw, 52px)',
            lineHeight: 0.9,
            color: '#F5F5F5',
            whiteSpace: 'pre-line',
          }}>
            {section.title}
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)',
            marginTop: '10px',
            textTransform: 'uppercase',
          }}>
            {section.sub}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Assembly checklist */}
      <AnimatePresence>
        {inSection(0, 0.20) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              right: '48px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            {assemblyParts.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: partsVisible[i] > 0.1 ? 1 : 0.2, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                }}
              >
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: partsVisible[i] > 0.5 ? '#E8002D' : 'rgba(255,255,255,0.15)',
                  boxShadow: partsVisible[i] > 0.5 ? '0 0 8px #E8002D' : 'none',
                  transition: 'all 0.3s',
                  flexShrink: 0,
                }} />
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  color: partsVisible[i] > 0.5 ? '#F5F5F5' : 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}>
                  {name}
                </div>
              </motion.div>
            ))}
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: '#E8002D',
            }}>
              {assemblyPct}% COMPLETE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal meter */}
      <AnimatePresence>
        {inSection(0.20, 0.40) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}>
              REVEAL
            </div>
            <div style={{ width: '200px', height: '1px', background: 'rgba(255,255,255,0.1)' }}>
              <div style={{
                height: '100%',
                width: `${revealPct}%`,
                background: 'linear-gradient(to right, #E8002D, #FFD700)',
                boxShadow: '0 0 10px #E8002D',
                transition: 'width 0.1s',
              }} />
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '48px',
              color: '#F5F5F5',
              lineHeight: 1,
              marginTop: '8px',
            }}>
              {revealPct}<span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.3)' }}>%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 360 rotation indicator */}
      <AnimatePresence>
        {inSection(0.40, 0.60) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '60px',
              right: '48px',
              zIndex: 50,
              textAlign: 'right',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '4px',
            }}>
              ROTATION
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '64px',
              color: '#E8002D',
              lineHeight: 1,
            }}>
              {rotDeg}<span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.3)' }}>°</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed display */}
      <AnimatePresence>
        {inSection(0.60, 0.80) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '60px',
              left: '48px',
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '4px',
            }}>
              VELOCITY
            </div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '80px',
              color: raceSpeed > 250 ? '#E8002D' : raceSpeed > 150 ? '#FFD700' : '#F5F5F5',
              lineHeight: 1,
              transition: 'color 0.3s',
            }}>
              {raceSpeed}
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.5em',
              color: 'rgba(255,255,255,0.2)',
            }}>
              KM / H
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final CTA */}
      <AnimatePresence>
        {s >= 0.92 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              textAlign: 'center',
              pointerEvents: 'all',
            }}
          >
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(40px, 7vw, 90px)',
              color: '#F5F5F5',
              lineHeight: 0.9,
              marginBottom: '32px',
            }}>
              READY TO <span style={{ color: '#E8002D' }}>RACE</span>
            </div>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '16px 52px',
                border: '1px solid #E8002D',
                color: '#F5F5F5',
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                background: 'transparent',
                transition: 'background 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#E8002D'
                e.currentTarget.style.boxShadow = '0 0 40px rgba(232,0,45,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              ENTER THE GRID
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll hint */}
      {s < 0.02 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            width: '1px',
            height: '50px',
            background: 'linear-gradient(to bottom, #E8002D, transparent)',
            animation: 'pulse-red 2s ease-in-out infinite',
          }} />
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.25)',
          }}>
            SCROLL TO BUILD
          </div>
        </motion.div>
      )}
    </>
  )
}
