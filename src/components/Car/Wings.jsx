import * as THREE from 'three'

const mWingRed  = new THREE.MeshStandardMaterial({ color: '#CC0000', metalness: 0.28, roughness: 0.22, side: THREE.DoubleSide, envMapIntensity: 1.8 })
const mCarbon   = new THREE.MeshStandardMaterial({ color: '#0d0d0d', metalness: 0.30, roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 1.4 })
const mCarbonF  = new THREE.MeshStandardMaterial({ color: '#0d0d0d', metalness: 0.30, roughness: 0.45, envMapIntensity: 1.4 })
const mWhite    = new THREE.MeshStandardMaterial({ color: '#EFEFEF', metalness: 0.06, roughness: 0.28 })

export default function Wings() {
  return (
    <group>

      {/* ══════════════════ FRONT WING ══════════════════ */}
      {/* Sits very close to ground, very wide */}
      <group position={[0, -0.10, 3.32]}>

        {/* Main plane — full span */}
        <mesh material={mWingRed} castShadow>
          <boxGeometry args={[2.12, 0.044, 0.56]} />
        </mesh>

        {/* Flap 1 */}
        <mesh material={mWingRed} position={[0, 0.065, -0.19]} rotation={[-0.17, 0, 0]} castShadow>
          <boxGeometry args={[1.82, 0.036, 0.32]} />
        </mesh>

        {/* Flap 2 — inboard section only */}
        <mesh material={mWingRed} position={[0, 0.125, -0.33]} rotation={[-0.24, 0, 0]} castShadow>
          <boxGeometry args={[1.42, 0.030, 0.26]} />
        </mesh>

        {/* Flap 3 — outermost cascade */}
        <mesh material={mWingRed} position={[0, 0.182, -0.43]} rotation={[-0.30, 0, 0]} castShadow>
          <boxGeometry args={[0.96, 0.026, 0.20]} />
        </mesh>

        {/* Neutral section (inboard flat) */}
        <mesh material={mCarbon} position={[0, 0.048, -0.08]} castShadow>
          <boxGeometry args={[0.42, 0.030, 0.38]} />
        </mesh>

        {/* Endplates — tall complex shape */}
        {[-1, 1].map((s, i) => (
          <group key={i}>
            {/* Main endplate */}
            <mesh material={mCarbon} position={[s * 1.07, 0.08, -0.05]} castShadow>
              <boxGeometry args={[0.032, 0.32, 0.66]} />
            </mesh>
            {/* Endplate lower extension */}
            <mesh material={mCarbon} position={[s * 1.07, -0.06, -0.24]} rotation={[0, 0, s * -0.25]} castShadow>
              <boxGeometry args={[0.032, 0.11, 0.26]} />
            </mesh>
            {/* Cascade vane outer */}
            <mesh material={mCarbon} position={[s * 0.92, 0.042, 0.22]} rotation={[0, s * 0.28, s * 0.12]} castShadow>
              <boxGeometry args={[0.16, 0.022, 0.24]} />
            </mesh>
            {/* Cascade vane inner */}
            <mesh material={mCarbon} position={[s * 0.82, 0.055, 0.12]} rotation={[0, s * 0.18, s * 0.08]} castShadow>
              <boxGeometry args={[0.12, 0.018, 0.20]} />
            </mesh>
            {/* Endplate turning vane */}
            <mesh material={mCarbon} position={[s * 0.96, 0.095, -0.10]} rotation={[0.10, 0, 0]} castShadow>
              <boxGeometry args={[0.025, 0.08, 0.18]} />
            </mesh>
          </group>
        ))}

        {/* Wing mounting pylons (connect to nose) */}
        {[-1, 1].map((s, i) => (
          <mesh key={i} material={mCarbonF} position={[s * 0.32, 0.16, 0.10]} rotation={[0.20, 0, s * 0.04]} castShadow>
            <boxGeometry args={[0.030, 0.14, 0.30]} />
          </mesh>
        ))}
      </group>

      {/* ══════════════════ REAR WING ══════════════════ */}
      <group position={[0, 0.76, -1.98]}>

        {/* Main plane */}
        <mesh material={mWingRed} castShadow>
          <boxGeometry args={[1.06, 0.050, 0.42]} />
        </mesh>

        {/* DRS moveable flap */}
        <mesh material={mWingRed} position={[0, 0.068, 0.08]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.98, 0.038, 0.24]} />
        </mesh>

        {/* Endplates */}
        {[-1, 1].map((s, i) => (
          <group key={i}>
            <mesh material={mCarbon} position={[s * 0.55, 0.04, 0.04]} castShadow>
              <boxGeometry args={[0.036, 0.22, 0.52]} />
            </mesh>
            {/* Endplate top cutout detail */}
            <mesh material={mCarbon} position={[s * 0.55, 0.115, -0.10]} rotation={[0.14, 0, 0]} castShadow>
              <boxGeometry args={[0.036, 0.07, 0.18]} />
            </mesh>
            {/* Louvre vents on endplate */}
            {[0.02, 0.06, 0.10].map((y, j) => (
              <mesh key={j} material={mCarbon} position={[s * 0.554, y, 0.12]} castShadow>
                <boxGeometry args={[0.006, 0.016, 0.14]} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Beam wing */}
        <mesh material={mCarbon} position={[0, -0.24, 0.06]} castShadow>
          <boxGeometry args={[0.80, 0.028, 0.24]} />
        </mesh>

        {/* Swan-neck pylons — elegant curved mounts */}
        {[-1, 1].map((s, i) => (
          <group key={i}>
            {/* Upper section */}
            <mesh material={mCarbonF} position={[s * 0.22, -0.18, 0.02]} rotation={[0.10, 0, s * 0.08]} castShadow>
              <cylinderGeometry args={[0.024, 0.020, 0.38, 8]} />
            </mesh>
            {/* Lower section (angled outward) */}
            <mesh material={mCarbonF} position={[s * 0.24, -0.42, 0.02]} rotation={[0.04, 0, s * 0.14]} castShadow>
              <cylinderGeometry args={[0.022, 0.018, 0.40, 8]} />
            </mesh>
          </group>
        ))}

        {/* DRS actuator (visual detail) */}
        <mesh material={mWhite} position={[0, 0.060, -0.12]}>
          <boxGeometry args={[0.038, 0.022, 0.040]} />
        </mesh>
      </group>

      {/* ══════════════════ BARGEBOARD VANES ══════════════════ */}
      {[1, -1].map((side, i) => (
        <group key={i} position={[side * 0.66, 0.06, 0.90]}>
          {/* Main turning vane */}
          <mesh material={mCarbon} rotation={[0, side * 0.28, -side * 0.12]} castShadow>
            <boxGeometry args={[0.026, 0.18, 0.44]} />
          </mesh>
          {/* Secondary vane */}
          <mesh material={mCarbon} position={[side * 0.04, 0.04, -0.14]} rotation={[0, side * 0.18, -side * 0.08]} castShadow>
            <boxGeometry args={[0.020, 0.14, 0.32]} />
          </mesh>
          {/* Footplate */}
          <mesh material={mCarbon} position={[0, -0.06, 0.04]} castShadow>
            <boxGeometry args={[0.16, 0.014, 0.40]} />
          </mesh>
        </group>
      ))}

      {/* ══════════════════ FLOOR EDGE VANES ══════════════════ */}
      {[1, -1].map((side, i) => (
        <group key={i}>
          {[0, 0.30, 0.60].map((z, j) => (
            <mesh key={j} material={mCarbon}
              position={[side * 0.55, -0.025, 0.52 - z]}
              rotation={[0, 0, side * 0.16]}
              castShadow>
              <boxGeometry args={[0.020, 0.10, 0.22]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ══════════════════ MONKEY SEAT (rear diffuser wing) ══════════════════ */}
      <mesh material={mCarbon} position={[0, -0.20, -1.84]} rotation={[-0.30, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 0.025, 0.25]} />
      </mesh>

    </group>
  )
}
