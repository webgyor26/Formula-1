import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import CarBody, { useCarMaterials } from './CarBody'
import Wheels from './Wheels'
import Wings from './Wings'
import SparkSystem from './SparkSystem'
import { clamp01 } from '../../hooks/useScrollProgress'

export default function F1Car({ scrollProgress }) {
  const groupRef = useRef()
  const wheelRotRef = useRef(0)
  const sparkRef = useRef(0)
  const engineGlowRef = useRef(0)
  const materials = useCarMaterials()

  useFrame((_, dt) => {
    if (!groupRef.current) return
    const s = scrollProgress

    // ---- Position / rotation ----
    let py = -4, pz = 0, rx = 0, ry = 0, sc = 1

    if (s >= 0.06 && s < 0.28) {
      // Rise from darkness
      const t = clamp01(s, 0.06, 0.28)
      const e = 1 - Math.pow(1 - t, 3) // ease-out cubic
      py = -4 + e * 4.2
      ry = (1 - e) * 0.6
    } else if (s >= 0.28 && s < 0.42) {
      // Settled — slight lean
      const t = clamp01(s, 0.28, 0.42)
      py = 0.2
      rx = -t * 0.07
      ry = (1 - clamp01(s, 0.28, 0.36)) * 0.1
    } else if (s >= 0.42 && s < 0.55) {
      // Tunnel — car moves forward
      const t = clamp01(s, 0.42, 0.55)
      py = 0.2 - t * 0.08
      pz = -t * 2.5
    } else if (s >= 0.55 && s < 0.65) {
      // Speedometer — push car back / small
      const t = clamp01(s, 0.55, 0.65)
      py = 0.12 - t * 0.5
      pz = -2.5 - t * 1.5
      sc = 1 - t * 0.22
    } else if (s >= 0.65 && s < 0.75) {
      // Race — side tracking shot, car off to right
      const t = clamp01(s, 0.65, 0.75)
      py = 0.2
      pz = 0
      // car doesn't move, camera moves (handled in SceneCanvas)
    } else if (s >= 0.75) {
      py = 0.2
      pz = 0
    }

    groupRef.current.position.y = py
    groupRef.current.position.z = pz
    groupRef.current.rotation.x = rx
    groupRef.current.rotation.y = ry
    groupRef.current.scale.setScalar(sc)

    // ---- Wheel rotation ----
    const wheelSpeed = s > 0.28 ? clamp01(s, 0.28, 0.50) * 18 : 0
    wheelRotRef.current -= wheelSpeed * dt

    // ---- Sparks ----
    sparkRef.current = s > 0.32 && s < 0.72
      ? clamp01(s, 0.32, 0.40) * (1 - clamp01(s, 0.68, 0.72)) * 0.8
      : 0

    // ---- Engine glow ----
    engineGlowRef.current = s > 0.28 && s < 0.80
      ? clamp01(s, 0.28, 0.42) * (1 - clamp01(s, 0.75, 0.80))
      : 0
  })

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      <CarBody materials={materials} engineGlow={engineGlowRef.current} />
      <Wheels wheelRot={wheelRotRef.current} />
      <Wings />
      <SparkSystem intensity={sparkRef.current} />
    </group>
  )
}
