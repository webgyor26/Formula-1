import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useSceneStore from '../store/useSceneStore'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const lenisRef = useRef(null)
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ({ progress }) => {
      setScrollProgress(progress)
      ScrollTrigger.update()
    })

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [setScrollProgress])

  return lenisRef
}
