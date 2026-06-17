import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useExperienceStore from './useExperienceStore'

function CarBody() {
  return (
    <group>
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

export default function RevealScene() {
  const groupRef = useRef()
  const light1Ref = useRef()
  const light2Ref = useRef()
  const dirLightRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    const p = useExperienceStore.getState().scrollProgress
    groupRef.current.visible = p >= 0.18 && p < 0.42
    if (!groupRef.current.visible) return

    const t = Math.min(1, Math.max(0, (p - 0.2) / 0.2))
    if (light1Ref.current) light1Ref.current.intensity = t * 8
    if (light2Ref.current) light2Ref.current.intensity = t * 8
    if (dirLightRef.current) dirLightRef.current.intensity = t * 2
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.02} />
      <pointLight ref={light1Ref} position={[-3, 2, 3]} intensity={0} color="#fff" />
      <pointLight ref={light2Ref} position={[3, 2, 3]} intensity={0} color="#E8002D" />
      <directionalLight ref={dirLightRef} position={[0, 5, 5]} intensity={0} />
      <CarBody />
    </group>
  )
}
