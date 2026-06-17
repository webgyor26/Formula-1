import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useExperienceStore from './useExperienceStore'
import * as THREE from 'three'

function Track() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -10]}>
      <planeGeometry args={[8, 40]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

function TrackLines() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      const p = useExperienceStore.getState().scrollProgress
      if (p >= 0.6 && p < 0.8) {
        const t = (p - 0.6) / 0.2
        ref.current.position.z = (clock.elapsedTime * 10 * t) % 2
      }
    }
  })
  return (
    <group ref={ref}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, -i * 4]}>
          <planeGeometry args={[0.15, 1.5]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}
    </group>
  )
}

function CarBody() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const p = useExperienceStore.getState().scrollProgress
    if (p >= 0.6 && p < 0.8) {
      const t = (p - 0.6) / 0.2
      ref.current.rotation.z = Math.sin(t * Math.PI * 4) * 0.05
    } else {
      ref.current.rotation.z = 0
    }
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.15, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[2, 0.3, 0.8]} />
        <meshStandardMaterial color="#16213e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, 1.8]}>
        <boxGeometry args={[2.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#E8002D" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.8, -1.8]}>
        <boxGeometry args={[1.6, 0.05, 0.2]} />
        <meshStandardMaterial color="#E8002D" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.5, -1.8]}>
        <boxGeometry args={[0.05, 0.6, 0.2]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.9, 0.18, 0]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.9, 0.18, 0]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.45, -0.4]}>
        <boxGeometry args={[0.6, 0.35, 1.4]} />
        <meshStandardMaterial color="#E8002D" metalness={0.8} roughness={0.15} />
      </mesh>
      {[[-1.1, -0.05, 1.2],[1.1, -0.05, 1.2],[-1.1, -0.05, -1.2],[1.1, -0.05, -1.2]].map((wp, i) => (
        <mesh key={i} position={wp} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.18, 16, 32]} />
          <meshStandardMaterial color="#111" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export default function RacingScene() {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    const p = useExperienceStore.getState().scrollProgress
    groupRef.current.visible = p >= 0.58 && p < 0.82
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
      <pointLight position={[-3, 3, 3]} intensity={1} color="#E8002D" />
      <Track />
      <TrackLines />
      <CarBody />
    </group>
  )
}
