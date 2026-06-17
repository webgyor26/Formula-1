import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'
import { clamp01 } from '../../hooks/useScrollProgress'

// Shared materials
const tireMat   = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0, roughness: 0.95 })
const rimMat    = new THREE.MeshStandardMaterial({ color: '#C0C0C0', metalness: 0.95, roughness: 0.06, envMapIntensity: 2.5 })
const brakeMat  = new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.8, roughness: 0.25, emissive: new THREE.Color('#FF2200'), emissiveIntensity: 0 })
const centerMat = new THREE.MeshStandardMaterial({ color: '#E8E8E8', metalness: 0.98, roughness: 0.04, envMapIntensity: 3 })

function Spoke({ angle }) {
  return (
    <mesh
      material={rimMat}
      rotation={[0, 0, angle]}
    >
      <boxGeometry args={[0.024, 0.26, 0.042]} />
    </mesh>
  )
}

function SingleWheel({ position, rear }) {
  const spinRef  = useRef()
  const brakeRef = useRef()
  const brakeGlow = useRef(0)

  const tireW  = rear ? 0.38 : 0.28
  const tireR  = rear ? 0.345 : 0.300
  const spokeAngles = useMemo(
    () => Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2),
    []
  )

  useFrame((_, dt) => {
    const { scrollProgress: s } = useSceneStore.getState()
    const speed = clamp01(s, 0.28, 0.60) * 28 + clamp01(s, 0.60, 0.75) * 10
    if (spinRef.current) spinRef.current.rotation.x -= speed * dt

    // Brake glow when decelerating
    brakeGlow.current = clamp01(s, 0.42, 0.46) * 0.6 + clamp01(s, 0.60, 0.65) * 0.4
    if (brakeRef.current) brakeRef.current.material.emissiveIntensity = brakeGlow.current
  })

  return (
    <group position={position}>
      {/* Spin group — axis along X (sideways), so rotation.x = rolling */}
      <group ref={spinRef}>
        {/* Tyre — torus */}
        <mesh material={tireMat} castShadow rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[tireR, tireW * 0.48, 20, 56]} />
        </mesh>

        {/* Rim barrel */}
        <mesh material={rimMat} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[tireR * 0.62, tireR * 0.62, tireW * 0.9, 24]} />
        </mesh>

        {/* Spokes — in X-aligned plane */}
        <group rotation={[0, 0, Math.PI / 2]}>
          {spokeAngles.map((a, i) => <Spoke key={i} angle={a} />)}
          {/* Center cap */}
          <mesh material={centerMat}>
            <cylinderGeometry args={[0.055, 0.055, 0.058, 16]} />
          </mesh>
        </group>

        {/* Brake disc */}
        <mesh ref={brakeRef} material={brakeMat.clone()} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[tireR * 0.40, tireR * 0.40, 0.048, 24]} />
        </mesh>

        {/* Tyre tread lines (subtle) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, (i / 5) * Math.PI * 2, Math.PI / 2]}>
            <torusGeometry args={[tireR, 0.006, 6, 56]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function Wheels() {
  return (
    <group>
      {/* Front wheels — slightly inward & wider track */}
      <SingleWheel position={[ 0.76, 0,  1.65]} rear={false} />
      <SingleWheel position={[-0.76, 0,  1.65]} rear={false} />
      {/* Rear wheels — wider track */}
      <SingleWheel position={[ 0.84, 0, -1.44]} rear={true}  />
      <SingleWheel position={[-0.84, 0, -1.44]} rear={true}  />
    </group>
  )
}
