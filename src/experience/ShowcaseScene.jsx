import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useExperienceStore from './useExperienceStore'
import * as THREE from 'three'

function CarBody() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.15, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[2, 0.3, 0.8]} />
        <meshStandardMaterial color="#16213e" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.05, 1.8]}>
        <boxGeometry args={[2.2, 0.05, 0.3]} />
        <meshStandardMaterial color="#E8002D" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.8, -1.8]}>
        <boxGeometry args={[1.6, 0.05, 0.2]} />
        <meshStandardMaterial color="#E8002D" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.5, -1.8]}>
        <boxGeometry args={[0.05, 0.6, 0.2]} />
        <meshStandardMaterial color="#333" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[-0.9, 0.18, 0]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0.9, 0.18, 0]}>
        <boxGeometry args={[0.5, 0.3, 1.0]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.45, -0.4]}>
        <boxGeometry args={[0.6, 0.35, 1.4]} />
        <meshStandardMaterial color="#E8002D" metalness={0.9} roughness={0.1} />
      </mesh>
      {[[-1.1, -0.05, 1.2],[1.1, -0.05, 1.2],[-1.1, -0.05, -1.2],[1.1, -0.05, -1.2]].map((wp, i) => (
        <mesh key={i} position={wp} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.18, 16, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

export default function ShowcaseScene() {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    const p = useExperienceStore.getState().scrollProgress
    groupRef.current.visible = p >= 0.38 && p < 0.62
    if (!groupRef.current.visible) return

    const t = (p - 0.4) / 0.2
    groupRef.current.rotation.y = t * Math.PI * 2
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#fff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#E8002D" />
      <pointLight position={[0, 8, 0]} intensity={1} color="#FFD700" />
      <CarBody />
    </group>
  )
}
