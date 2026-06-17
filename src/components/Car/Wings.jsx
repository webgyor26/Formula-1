import { useMemo } from 'react'
import * as THREE from 'three'

const wingMat = new THREE.MeshStandardMaterial({ color: '#CC0000', metalness: 0.2, roughness: 0.28, side: THREE.DoubleSide })
const carbonMat = new THREE.MeshStandardMaterial({ color: '#141414', metalness: 0.12, roughness: 0.6, side: THREE.DoubleSide })

export default function Wings() {
  return (
    <group>
      {/* ===== FRONT WING ===== */}
      <group position={[0, -0.055, 3.32]}>
        {/* Main plane */}
        <mesh material={wingMat} castShadow><boxGeometry args={[1.82, 0.055, 0.48]} /></mesh>
        {/* Flap 1 */}
        <mesh material={wingMat} position={[0, 0.065, -0.18]} rotation={[-0.14, 0, 0]} castShadow>
          <boxGeometry args={[1.52, 0.042, 0.28]} />
        </mesh>
        {/* Flap 2 */}
        <mesh material={wingMat} position={[0, 0.12, -0.3]} rotation={[-0.22, 0, 0]} castShadow>
          <boxGeometry args={[1.22, 0.036, 0.22]} />
        </mesh>
        {/* End plates */}
        <mesh material={carbonMat} position={[0.895, 0.055, -0.08]} castShadow>
          <boxGeometry args={[0.038, 0.19, 0.56]} />
        </mesh>
        <mesh material={carbonMat} position={[-0.895, 0.055, -0.08]} castShadow>
          <boxGeometry args={[0.038, 0.19, 0.56]} />
        </mesh>
        {/* Pillar struts */}
        <mesh material={carbonMat} position={[0.28, 0.135, 0.08]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.038, 0.09, 0.28]} />
        </mesh>
        <mesh material={carbonMat} position={[-0.28, 0.135, 0.08]} rotation={[0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.038, 0.09, 0.28]} />
        </mesh>
      </group>

      {/* ===== REAR WING ===== */}
      <group position={[0, 0.66, -1.95]}>
        {/* Main element */}
        <mesh material={wingMat} castShadow><boxGeometry args={[0.98, 0.055, 0.38]} /></mesh>
        {/* DRS flap */}
        <mesh material={wingMat} position={[0, 0.07, 0.09]} rotation={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.88, 0.038, 0.2]} />
        </mesh>
        {/* End plates */}
        <mesh material={carbonMat} position={[0.52, 0.04, 0.06]} castShadow>
          <boxGeometry args={[0.038, 0.17, 0.46]} />
        </mesh>
        <mesh material={carbonMat} position={[-0.52, 0.04, 0.06]} castShadow>
          <boxGeometry args={[0.038, 0.17, 0.46]} />
        </mesh>
        {/* Support pylons */}
        <mesh material={carbonMat} position={[0.18, -0.3, 0.04]} castShadow>
          <boxGeometry args={[0.055, 0.6, 0.055]} />
        </mesh>
        <mesh material={carbonMat} position={[-0.18, -0.3, 0.04]} castShadow>
          <boxGeometry args={[0.055, 0.6, 0.055]} />
        </mesh>
      </group>

      {/* ===== BARGEBOARD / TURNING VANES ===== */}
      <mesh material={carbonMat} position={[0.62, 0.06, 0.85]} rotation={[0, 0.18, -0.1]} castShadow>
        <boxGeometry args={[0.03, 0.15, 0.38]} />
      </mesh>
      <mesh material={carbonMat} position={[-0.62, 0.06, 0.85]} rotation={[0, -0.18, 0.1]} castShadow>
        <boxGeometry args={[0.03, 0.15, 0.38]} />
      </mesh>
    </group>
  )
}
