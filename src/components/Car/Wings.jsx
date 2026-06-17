import * as THREE from 'three'

const wingRed   = new THREE.MeshStandardMaterial({ color: '#CC0000', metalness: 0.22, roughness: 0.26, side: THREE.DoubleSide })
const carbon    = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.14, roughness: 0.58, side: THREE.DoubleSide })
const carbonF   = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.14, roughness: 0.58 })
const whiteMat  = new THREE.MeshStandardMaterial({ color: '#F0F0F0', metalness: 0.05, roughness: 0.3 })

export default function Wings() {
  return (
    <group>

      {/* ====================== FRONT WING ====================== */}
      {/* Very wide — extends beyond rear tire width, close to ground */}
      <group position={[0, -0.06, 3.30]}>

        {/* Main plane — widest element, closest to ground */}
        <mesh material={wingRed} castShadow>
          <boxGeometry args={[2.05, 0.048, 0.52]} />
        </mesh>

        {/* Flap 1 */}
        <mesh material={wingRed} position={[0, 0.068, -0.18]} rotation={[-0.16, 0, 0]} castShadow>
          <boxGeometry args={[1.72, 0.038, 0.30]} />
        </mesh>

        {/* Flap 2 — inboard only */}
        <mesh material={wingRed} position={[0, 0.13, -0.30]} rotation={[-0.24, 0, 0]} castShadow>
          <boxGeometry args={[1.30, 0.032, 0.24]} />
        </mesh>

        {/* Flap 3 — outermost cascade */}
        <mesh material={wingRed} position={[0, 0.185, -0.38]} rotation={[-0.28, 0, 0]} castShadow>
          <boxGeometry args={[0.90, 0.028, 0.20]} />
        </mesh>

        {/* End plates — large complex shape */}
        <mesh material={carbon} position={[1.04, 0.07, -0.06]} castShadow>
          <boxGeometry args={[0.035, 0.28, 0.62]} />
        </mesh>
        <mesh material={carbon} position={[-1.04, 0.07, -0.06]} castShadow>
          <boxGeometry args={[0.035, 0.28, 0.62]} />
        </mesh>

        {/* End plate lower winglet */}
        <mesh material={carbon} position={[1.04, -0.04, -0.28]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.035, 0.10, 0.24]} />
        </mesh>
        <mesh material={carbon} position={[-1.04, -0.04, -0.28]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.035, 0.10, 0.24]} />
        </mesh>

        {/* Nose strut connections */}
        <mesh material={carbon} position={[0.32, 0.14, 0.10]} rotation={[0.2, 0, 0.05]} castShadow>
          <boxGeometry args={[0.036, 0.10, 0.32]} />
        </mesh>
        <mesh material={carbon} position={[-0.32, 0.14, 0.10]} rotation={[0.2, 0, -0.05]} castShadow>
          <boxGeometry args={[0.036, 0.10, 0.32]} />
        </mesh>

        {/* Front cascade vanes — on endplates */}
        <mesh material={carbon} position={[0.88, 0.045, 0.20]} rotation={[0, 0.3, 0.15]} castShadow>
          <boxGeometry args={[0.15, 0.025, 0.22]} />
        </mesh>
        <mesh material={carbon} position={[-0.88, 0.045, 0.20]} rotation={[0, -0.3, -0.15]} castShadow>
          <boxGeometry args={[0.15, 0.025, 0.22]} />
        </mesh>
      </group>

      {/* ====================== REAR WING ====================== */}
      {/* Tall, mounted high above car */}
      <group position={[0, 0.72, -1.96]}>

        {/* Main plane */}
        <mesh material={wingRed} castShadow>
          <boxGeometry args={[1.00, 0.052, 0.40]} />
        </mesh>

        {/* DRS moveable flap */}
        <mesh material={wingRed} position={[0, 0.07, 0.08]} rotation={[-0.10, 0, 0]} castShadow>
          <boxGeometry args={[0.92, 0.040, 0.22]} />
        </mesh>

        {/* End plates */}
        <mesh material={carbon} position={[ 0.53, 0.04, 0.04]} castShadow>
          <boxGeometry args={[0.038, 0.20, 0.50]} />
        </mesh>
        <mesh material={carbon} position={[-0.53, 0.04, 0.04]} castShadow>
          <boxGeometry args={[0.038, 0.20, 0.50]} />
        </mesh>

        {/* End plate top cutout visual */}
        <mesh material={carbon} position={[ 0.53, 0.10, -0.12]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.038, 0.08, 0.18]} />
        </mesh>
        <mesh material={carbon} position={[-0.53, 0.10, -0.12]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.038, 0.08, 0.18]} />
        </mesh>

        {/* Swan neck pylons — elegant curved supports */}
        <mesh material={carbon} position={[ 0.22, -0.34, 0.02]} rotation={[0.06, 0, 0.12]} castShadow>
          <cylinderGeometry args={[0.026, 0.022, 0.72, 8]} />
        </mesh>
        <mesh material={carbon} position={[-0.22, -0.34, 0.02]} rotation={[0.06, 0, -0.12]} castShadow>
          <cylinderGeometry args={[0.026, 0.022, 0.72, 8]} />
        </mesh>

        {/* DRS activator (visual) */}
        <mesh material={whiteMat} position={[0, 0.065, -0.11]}>
          <boxGeometry args={[0.04, 0.025, 0.04]} />
        </mesh>
      </group>

      {/* ====================== BARGEBOARD VANES ====================== */}
      {/* Complex aerodynamic turning vanes beside sidepods */}
      {[1, -1].map((side, i) => (
        <group key={i} position={[side * 0.65, 0.06, 0.88]}>
          {/* Main turning vane */}
          <mesh material={carbon} rotation={[0, side * 0.28, -side * 0.12]} castShadow>
            <boxGeometry args={[0.028, 0.18, 0.42]} />
          </mesh>
          {/* Secondary vane */}
          <mesh material={carbon} position={[side * 0.04, 0.04, -0.12]} rotation={[0, side * 0.18, -side * 0.08]} castShadow>
            <boxGeometry args={[0.022, 0.14, 0.30]} />
          </mesh>
          {/* Vertical divider */}
          <mesh material={carbon} position={[0, -0.04, 0.08]} rotation={[side * 0.14, 0, 0]} castShadow>
            <boxGeometry args={[0.022, 0.08, 0.22]} />
          </mesh>
        </group>
      ))}

      {/* ====================== FLOOR EDGE VANES ====================== */}
      {[1, -1].map((side, i) => (
        <group key={i}>
          {[0, 0.28, 0.56].map((z, j) => (
            <mesh key={j} material={carbon}
              position={[side * 0.54, -0.02, 0.55 - z]}
              rotation={[0, 0, side * 0.15]}
              castShadow>
              <boxGeometry args={[0.022, 0.09, 0.20]} />
            </mesh>
          ))}
        </group>
      ))}

    </group>
  )
}
