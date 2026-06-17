import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import CarBody, { useCarMaterials } from './CarBody'
import Wheels from './Wheels'
import Wings from './Wings'
import SparkSystem from './SparkSystem'
import { clamp01 } from '../../hooks/useScrollProgress'

export default function F1Car({ scrollProgress }) {
  const groupRef      = useRef()
  const sparkRef      = useRef(0)
  const engineGlowRef = useRef(0)
  const materials     = useCarMaterials()

  useFrame((_, dt) => {
    if (!groupRef.current) return
    const s = scrollProgress

    let py = -4, pz = 0, rx = 0, ry = 0, sc = 1

    // Scene 1: Rise from darkness
    if (s >= 0.06 && s < 0.28) {
      const t = clamp01(s, 0.06, 0.28)
      const e = 1 - Math.pow(1 - t, 3)
      py = -4 + e * 4.22
      ry = (1 - e) * 0.55
    } else if (s >= 0.28 && s < 0.42) {
      py = 0.18
      rx = -clamp01(s, 0.28, 0.42) * 0.06
      ry = (1 - clamp01(s, 0.28, 0.36)) * 0.08
    } else if (s >= 0.42 && s < 0.55) {
      // Tunnel
      const t = clamp01(s, 0.42, 0.55)
      py = 0.18 - t * 0.10
      pz = -t * 2.6
    } else if (s >= 0.55 && s < 0.65) {
      // Speedometer — push back
      const t = clamp01(s, 0.55, 0.65)
      py = 0.08 - t * 0.55
      pz = -2.6 - t * 1.5
      sc = 1 - t * 0.24
    } else if (s >= 0.65 && s < 0.75) {
      py = 0.18
      pz = 0
    } else if (s >= 0.75) {
      py = 0.18
      pz = 0
    }

    groupRef.current.position.y  = py
    groupRef.current.position.z  = pz
    groupRef.current.rotation.x  = rx
    groupRef.current.rotation.y  = ry
    groupRef.current.scale.setScalar(sc)

    // Sparks
    sparkRef.current = (s > 0.32 && s < 0.72)
      ? clamp01(s, 0.32, 0.42) * (1 - clamp01(s, 0.68, 0.72)) * 0.85
      : 0

    // Engine glow
    engineGlowRef.current = (s > 0.28 && s < 0.80)
      ? clamp01(s, 0.28, 0.42) * (1 - clamp01(s, 0.76, 0.80))
      : 0
  })

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      <CarBody materials={materials} engineGlow={engineGlowRef.current} />
      <Wheels />
      <Wings />
      <SparkSystem intensity={sparkRef.current} />
    </group>
  )
}
