import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useExperienceStore from './useExperienceStore'

const PARTICLE_COUNT = 200

export default function SparkScene() {
  const groupRef = useRef()
  const pointsRef = useRef()

  const { positions, velocities, colors, lifetimes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const lifetimes = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = -0.4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3 + 1.0

      velocities[i * 3] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 1] = -(Math.random() * 0.05 + 0.02)
      velocities[i * 3 + 2] = Math.random() * 0.1

      const orange = Math.random()
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = orange * 0.6
      colors[i * 3 + 2] = orange * 0.1

      lifetimes[i] = Math.random()
    }

    return { positions, velocities, colors, lifetimes }
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current || !pointsRef.current) return
    const p = useExperienceStore.getState().scrollProgress
    groupRef.current.visible = p >= 0.78

    if (!groupRef.current.visible) return

    const t = Math.min(1, (p - 0.8) / 0.2)
    const posAttr = pointsRef.current.geometry.attributes.position

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      lifetimes[i] -= delta * 1.5
      if (lifetimes[i] <= 0) {
        lifetimes[i] = Math.random()
        posAttr.array[i * 3] = (Math.random() - 0.5) * 0.5
        posAttr.array[i * 3 + 1] = -0.4
        posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 0.3 + 1.0
      } else {
        posAttr.array[i * 3] += velocities[i * 3] * t
        posAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * t
        posAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * t
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <pointLight position={[0, 3, 3]} intensity={2} color="#FFD700" />

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

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors sizeAttenuation transparent opacity={0.9} />
      </points>
    </group>
  )
}
