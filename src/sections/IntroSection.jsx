import { motion } from 'framer-motion'
import useSceneStore from '../store/useSceneStore'
import { clamp01 } from '../hooks/useScrollProgress'

export default function IntroSection() {
  const scrollProgress = useSceneStore((s) => s.scrollProgress)
  const isLoaded = useSceneStore((s) => s.isLoaded)
  const opacity = 1 - clamp01(scrollProgress, 0.08, 0.20)

  return (
    <div
      className="intro-content"
      style={{ opacity, transition: 'opacity 0.1s linear' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 32 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="intro-tagline">Formula 1 · Cinematic Experience</div>
        <h1 className="intro-title">
          INTO THE<br />
          <span className="red">RED</span>
        </h1>
        <p className="intro-subtitle">Where Machines Become Legends</p>
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.8 : 0 }}
        transition={{ delay: 1.8 }}
        style={{ pointerEvents: 'none' }}
      >
        <div className="scroll-indicator-line" />
        <div className="scroll-indicator-text">Scroll</div>
      </motion.div>
    </div>
  )
}
