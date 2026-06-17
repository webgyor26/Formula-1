import { useMemo } from 'react'
import * as THREE from 'three'

export default function FloorReflection() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#080808',
    metalness: 0.82,
    roughness: 0.12,
    envMapIntensity: 1.4,
  }), [])

  return (
    <>
      {/* Main reflective floor */}
      <mesh material={mat} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.44, 0]} receiveShadow>
        <planeGeometry args={[22, 32]} />
      </mesh>

      {/* Red under-glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.43, 0]}>
        <ringGeometry args={[0.4, 2.2, 32]} />
        <meshBasicMaterial color="#E8002D" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  )
}
