import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'

export function useCarMaterials() {
  return useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: '#CC0000',
      metalness: 0.30,
      roughness: 0.20,
      envMapIntensity: 1.8,
    })
    const carbon = new THREE.MeshStandardMaterial({
      color: '#111111',
      metalness: 0.14,
      roughness: 0.55,
      envMapIntensity: 0.9,
    })
    const chrome = new THREE.MeshStandardMaterial({
      color: '#D8D8D8',
      metalness: 0.97,
      roughness: 0.04,
      envMapIntensity: 2.5,
    })
    const glow = new THREE.MeshStandardMaterial({
      color: '#FF4400',
      emissive: new THREE.Color('#FF2200'),
      emissiveIntensity: 0,
      roughness: 0.28,
    })
    const yellow = new THREE.MeshStandardMaterial({
      color: '#FFD700',
      metalness: 0.1,
      roughness: 0.4,
    })
    const white = new THREE.MeshStandardMaterial({ color: '#F0F0F0', metalness: 0.05, roughness: 0.35 })
    const black = new THREE.MeshStandardMaterial({ color: '#080808', metalness: 0.05, roughness: 0.7 })
    return { body, carbon, chrome, glow, yellow, white, black }
  }, [])
}

export default function CarBody({ materials, engineGlow = 0 }) {
  useFrame(() => {
    if (materials.glow) materials.glow.emissiveIntensity = engineGlow * 4
  })

  const { body, carbon, chrome, glow, yellow, white, black } = materials

  return (
    <group>

      {/* ============ NOSE CONE — narrow tapered ============ */}
      {/* Tip — very narrow */}
      <mesh material={white} position={[0, 0.07, 3.30]} castShadow>
        <boxGeometry args={[0.07, 0.06, 0.22]} />
      </mesh>
      {/* Nose step 1 */}
      <mesh material={body} position={[0, 0.09, 3.05]} castShadow>
        <boxGeometry args={[0.14, 0.08, 0.28]} />
      </mesh>
      {/* Nose step 2 */}
      <mesh material={body} position={[0, 0.115, 2.72]} castShadow>
        <boxGeometry args={[0.22, 0.10, 0.34]} />
      </mesh>
      {/* Nose base to chassis join */}
      <mesh material={body} position={[0, 0.14, 2.38]} castShadow>
        <boxGeometry args={[0.32, 0.13, 0.42]} />
      </mesh>

      {/* ============ MAIN CHASSIS — very flat & low ============ */}
      <mesh material={body} position={[0, 0.165, 0.6]} castShadow>
        <boxGeometry args={[0.50, 0.155, 3.0]} />
      </mesh>
      {/* Rear taper */}
      <mesh material={body} position={[0, 0.165, -1.55]} castShadow>
        <boxGeometry args={[0.46, 0.145, 0.65]} />
      </mesh>

      {/* ============ COCKPIT ============ */}
      {/* Cockpit rim */}
      <mesh material={carbon} position={[0, 0.275, 0.68]} castShadow>
        <boxGeometry args={[0.44, 0.065, 0.42]} />
      </mesh>
      {/* Cockpit opening (dark inside) */}
      <mesh material={black} position={[0, 0.255, 0.72]}>
        <boxGeometry args={[0.28, 0.04, 0.24]} />
      </mesh>
      {/* Headrest */}
      <mesh material={body} position={[0, 0.31, 0.36]} castShadow>
        <boxGeometry args={[0.18, 0.07, 0.22]} />
      </mesh>

      {/* ============ HALO ============ */}
      <mesh material={chrome} position={[0, 0.51, 0.66]} castShadow>
        <torusGeometry args={[0.20, 0.023, 8, 24, Math.PI]} />
      </mesh>
      {/* Halo center pillar */}
      <mesh material={chrome} position={[0, 0.40, 0.86]} castShadow>
        <cylinderGeometry args={[0.023, 0.023, 0.22, 8]} />
      </mesh>

      {/* ============ SIDEPODS — large with visible inlet ============ */}
      {/* Left sidepod body */}
      <mesh material={body} position={[0.43, 0.135, 0.15]} castShadow>
        <boxGeometry args={[0.31, 0.215, 1.90]} />
      </mesh>
      {/* Left inlet opening (dark) */}
      <mesh material={black} position={[0.52, 0.16, 0.90]}>
        <boxGeometry args={[0.10, 0.14, 0.22]} />
      </mesh>
      {/* Left inlet lip */}
      <mesh material={carbon} position={[0.50, 0.17, 1.05]} castShadow>
        <boxGeometry args={[0.13, 0.16, 0.055]} />
      </mesh>
      {/* Left sidepod undercut */}
      <mesh material={carbon} position={[0.52, 0.042, 0.18]} castShadow>
        <boxGeometry args={[0.10, 0.052, 1.55]} />
      </mesh>

      {/* Right sidepod body */}
      <mesh material={body} position={[-0.43, 0.135, 0.15]} castShadow>
        <boxGeometry args={[0.31, 0.215, 1.90]} />
      </mesh>
      {/* Right inlet */}
      <mesh material={black} position={[-0.52, 0.16, 0.90]}>
        <boxGeometry args={[0.10, 0.14, 0.22]} />
      </mesh>
      <mesh material={carbon} position={[-0.50, 0.17, 1.05]} castShadow>
        <boxGeometry args={[0.13, 0.16, 0.055]} />
      </mesh>
      <mesh material={carbon} position={[-0.52, 0.042, 0.18]} castShadow>
        <boxGeometry args={[0.10, 0.052, 1.55]} />
      </mesh>

      {/* ============ ENGINE COVER / AIRBOX ============ */}
      <mesh material={carbon} position={[0, 0.365, -0.30]} castShadow>
        <boxGeometry args={[0.26, 0.205, 1.30]} />
      </mesh>
      {/* Airbox intake */}
      <mesh material={carbon} position={[0, 0.535, 0.14]} castShadow>
        <boxGeometry args={[0.155, 0.105, 0.26]} />
      </mesh>
      {/* Airbox opening */}
      <mesh material={black} position={[0, 0.545, 0.28]}>
        <boxGeometry args={[0.10, 0.07, 0.04]} />
      </mesh>

      {/* ============ FLOOR / UNDERSIDE ============ */}
      <mesh material={carbon} position={[0, -0.03, 0.4]} receiveShadow castShadow>
        <boxGeometry args={[0.95, 0.035, 4.05]} />
      </mesh>
      {/* Diffuser — angled up at rear */}
      <mesh material={carbon} position={[0, 0.055, -1.95]} rotation={[0.32, 0, 0]} castShadow>
        <boxGeometry args={[0.76, 0.050, 0.68]} />
      </mesh>
      {/* Diffuser fins */}
      {[-0.22, 0, 0.22].map((x, i) => (
        <mesh key={i} material={carbon} position={[x, 0.04, -1.88]} rotation={[0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.03, 0.08, 0.64]} />
        </mesh>
      ))}

      {/* ============ ENGINE GLOW ============ */}
      <mesh material={glow} position={[0, 0.22, -0.48]}>
        <boxGeometry args={[0.20, 0.095, 0.55]} />
      </mesh>

      {/* ============ WHEEL ARCHES — small lips ============ */}
      {/* Front left */}
      <mesh material={body} position={[0.68, 0.125, 1.62]} castShadow>
        <boxGeometry args={[0.055, 0.245, 0.26]} />
      </mesh>
      {/* Front right */}
      <mesh material={body} position={[-0.68, 0.125, 1.62]} castShadow>
        <boxGeometry args={[0.055, 0.245, 0.26]} />
      </mesh>
      {/* Rear left arch */}
      <mesh material={body} position={[0.76, 0.14, -1.42]} castShadow>
        <boxGeometry args={[0.062, 0.275, 0.32]} />
      </mesh>
      {/* Rear right arch */}
      <mesh material={body} position={[-0.76, 0.14, -1.42]} castShadow>
        <boxGeometry args={[0.062, 0.275, 0.32]} />
      </mesh>

      {/* ============ FRONT SUSPENSION ARMS ============ */}
      {[1, -1].map((side, i) => (
        <group key={i}>
          <mesh material={carbon} position={[side * 0.44, 0.10, 1.72]} rotation={[0, side * 0.18, side * 0.12]} castShadow>
            <boxGeometry args={[0.26, 0.022, 0.022]} />
          </mesh>
          <mesh material={carbon} position={[side * 0.44, 0.03, 1.58]} rotation={[0, side * 0.22, -side * 0.1]} castShadow>
            <boxGeometry args={[0.28, 0.020, 0.020]} />
          </mesh>
        </group>
      ))}

      {/* ============ RACING NUMBER + LIVERY DETAILS ============ */}
      {/* Number plate on nose */}
      <mesh material={white} position={[0, 0.14, 2.80]}>
        <boxGeometry args={[0.16, 0.055, 0.06]} />
      </mesh>
      {/* Yellow accent stripe */}
      <mesh material={materials.yellow} position={[0, 0.24, 0.6]} castShadow>
        <boxGeometry args={[0.503, 0.012, 3.0]} />
      </mesh>
      {/* Shark fin at engine cover */}
      <mesh material={carbon} position={[0, 0.51, -0.65]} castShadow>
        <boxGeometry args={[0.028, 0.30, 0.75]} />
      </mesh>

    </group>
  )
}
