import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'
import { clamp01 } from '../../hooks/useScrollProgress'

const wallMat = new THREE.MeshStandardMaterial({ color: '#0d0d0d', metalness: 0.35, roughness: 0.75, side: THREE.BackSide })
const ringMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.4, roughness: 0.6 })

export default function TunnelGeometry() {
  const groupRef = useRef()
  const lightMats = useRef([])

  // Create light strip materials
  const lights = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    mat: new THREE.MeshBasicMaterial({ color: '#FFCC55', transparent: true, opacity: 0 }),
    offset: i,
  })), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const { scrollProgress } = useSceneStore.getState()
    const inT  = clamp01(scrollProgress, 0.42, 0.50)
    const outT = clamp01(scrollProgress, 0.54, 0.60)
    const vis = inT * (1 - outT)
    groupRef.current.visible = vis > 0.005

    const speed = inT * 9
    const t = clock.getElapsedTime()

    lights.forEach(({ mat, offset }) => {
      const phase = (t * speed + offset * 0.8) % 1
      mat.opacity = phase < 0.12 ? 0.9 : phase < 0.28 ? 0.05 : 0
    })
  })

  return (
    <group ref={groupRef} visible={false}>
      {/* Main tunnel cylinder */}
      <mesh material={wallMat} position={[0, 0.6, -10]}>
        <cylinderGeometry args={[2.6, 2.6, 22, 18, 1, true]} />
      </mesh>

      {/* Entrance ring */}
      <mesh material={ringMat} position={[0, 0.6, -0.8]}>
        <torusGeometry args={[2.6, 0.12, 8, 24]} />
      </mesh>

      {/* Ceiling light strips */}
      {lights.map(({ mat }, i) => (
        <mesh key={i} material={mat} position={[0, 2.8, -1.2 - i * 0.95]}>
          <boxGeometry args={[0.55, 0.04, 0.14]} />
        </mesh>
      ))}

      {/* Floor lane markers */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`lane-${i}`} position={[0, -0.18, -1.5 - i * 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.07, 0.55]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}
