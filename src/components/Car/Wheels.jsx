import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const tireMat = new THREE.MeshStandardMaterial({ color: '#181818', metalness: 0, roughness: 0.92 })
const rimMat = new THREE.MeshStandardMaterial({ color: '#C0C0C0', metalness: 0.95, roughness: 0.08, envMapIntensity: 2 })
const brakeMat = new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.7, roughness: 0.3, emissive: new THREE.Color('#FF2200'), emissiveIntensity: 0 })

function Spokes() {
  return (
    <group>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} material={rimMat} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
          <boxGeometry args={[0.022, 0.24, 0.038]} />
        </mesh>
      ))}
      <mesh material={rimMat}><cylinderGeometry args={[0.052, 0.052, 0.065, 12]} /></mesh>
    </group>
  )
}

function Wheel({ position, rear, wheelRot }) {
  const groupRef = useRef()
  const w = rear ? 0.33 : 0.27
  const rad = rear ? 0.335 : 0.295

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = wheelRot
    }
  })

  return (
    <group position={position}>
      <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
        {/* Tyre */}
        <mesh material={tireMat} castShadow>
          <torusGeometry args={[rad, w * 0.5, 18, 48]} />
        </mesh>
        {/* Rim inner face */}
        <mesh material={rimMat} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[rad * 0.62, rad * 0.62, w * 0.88, 22]} />
        </mesh>
        {/* Spokes */}
        <group rotation={[Math.PI / 2, 0, 0]}><Spokes /></group>
        {/* Brake disc */}
        <mesh material={brakeMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[rad * 0.38, rad * 0.38, 0.045, 24]} />
        </mesh>
      </group>
    </group>
  )
}

export default function Wheels({ wheelRot = 0 }) {
  return (
    <group>
      <Wheel position={[ 0.74, 0, 1.62]} rear={false} wheelRot={wheelRot} />
      <Wheel position={[-0.74, 0, 1.62]} rear={false} wheelRot={wheelRot} />
      <Wheel position={[ 0.80, 0, -1.42]} rear={true}  wheelRot={wheelRot} />
      <Wheel position={[-0.80, 0, -1.42]} rear={true}  wheelRot={wheelRot} />
    </group>
  )
}
