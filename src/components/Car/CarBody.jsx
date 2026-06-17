import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function useCarMaterials() {
  return useMemo(() => {
    const body = new THREE.MeshStandardMaterial({ color: '#CC0000', metalness: 0.28, roughness: 0.22, envMapIntensity: 1.6 })
    const carbon = new THREE.MeshStandardMaterial({ color: '#141414', metalness: 0.12, roughness: 0.58, envMapIntensity: 0.8 })
    const chrome = new THREE.MeshStandardMaterial({ color: '#D4D4D4', metalness: 0.96, roughness: 0.045, envMapIntensity: 2.2 })
    const glow = new THREE.MeshStandardMaterial({ color: '#FF4400', emissive: new THREE.Color('#FF2200'), emissiveIntensity: 0, roughness: 0.3 })
    const white = new THREE.MeshStandardMaterial({ color: '#F0F0F0', metalness: 0.05, roughness: 0.35 })
    return { body, carbon, chrome, glow, white }
  }, [])
}

export default function CarBody({ materials, engineGlow = 0 }) {
  const glowRef = useRef()

  useFrame(() => {
    if (materials.glow) {
      materials.glow.emissiveIntensity = engineGlow * 3.5
    }
  })

  const { body, carbon, chrome, glow } = materials

  return (
    <group>
      {/* === CHASSIS === */}
      <mesh material={body} position={[0, 0.185, 0]} castShadow>
        <boxGeometry args={[0.52, 0.175, 3.8]} />
      </mesh>
      {/* Taper to nose */}
      <mesh material={body} position={[0, 0.14, 2.2]} castShadow>
        <boxGeometry args={[0.38, 0.13, 0.9]} />
      </mesh>
      <mesh material={body} position={[0, 0.10, 2.85]} castShadow>
        <boxGeometry args={[0.22, 0.09, 0.6]} />
      </mesh>
      {/* Nose tip */}
      <mesh material={body} position={[0, 0.07, 3.22]} castShadow>
        <boxGeometry args={[0.12, 0.065, 0.28]} />
      </mesh>

      {/* === SIDEPODS === */}
      <mesh material={body} position={[0.43, 0.115, 0.08]} castShadow>
        <boxGeometry args={[0.30, 0.21, 1.85]} />
      </mesh>
      <mesh material={body} position={[-0.43, 0.115, 0.08]} castShadow>
        <boxGeometry args={[0.30, 0.21, 1.85]} />
      </mesh>
      {/* Undercut */}
      <mesh material={carbon} position={[0.52, 0.04, 0.15]} castShadow>
        <boxGeometry args={[0.10, 0.055, 1.5]} />
      </mesh>
      <mesh material={carbon} position={[-0.52, 0.04, 0.15]} castShadow>
        <boxGeometry args={[0.10, 0.055, 1.5]} />
      </mesh>

      {/* === ENGINE COVER === */}
      <mesh material={carbon} position={[0, 0.365, -0.28]} castShadow>
        <boxGeometry args={[0.28, 0.21, 1.25]} />
      </mesh>
      {/* Airbox */}
      <mesh material={carbon} position={[0, 0.54, 0.12]} castShadow>
        <boxGeometry args={[0.16, 0.11, 0.28]} />
      </mesh>

      {/* === COCKPIT === */}
      <mesh material={carbon} position={[0, 0.29, 0.72]} castShadow>
        <boxGeometry args={[0.46, 0.07, 0.48]} />
      </mesh>

      {/* === HALO === */}
      <mesh material={chrome} position={[0, 0.525, 0.68]} castShadow>
        <torusGeometry args={[0.21, 0.024, 8, 22, Math.PI]} />
      </mesh>
      <mesh material={chrome} position={[0, 0.405, 0.88]}>
        <cylinderGeometry args={[0.024, 0.024, 0.235, 8]} />
      </mesh>

      {/* === FLOOR === */}
      <mesh material={carbon} position={[0, -0.025, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.92, 0.038, 4.1]} />
      </mesh>
      {/* Diffuser */}
      <mesh material={carbon} position={[0, 0.06, -2.05]} rotation={[0.28, 0, 0]} castShadow>
        <boxGeometry args={[0.72, 0.055, 0.65]} />
      </mesh>

      {/* === ENGINE GLOW === */}
      <mesh material={glow} position={[0, 0.225, -0.52]}>
        <boxGeometry args={[0.22, 0.10, 0.58]} />
      </mesh>

      {/* White racing number on nose */}
      <mesh material={materials.white} position={[0, 0.145, 2.62]}>
        <boxGeometry args={[0.18, 0.04, 0.09]} />
      </mesh>
    </group>
  )
}
