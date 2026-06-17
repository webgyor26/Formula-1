import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useExperienceStore from './useExperienceStore'

// ─── Utility ───────────────────────────────────────────────────────────────
function norm(v, lo, hi) {
  return Math.max(0, Math.min(1, (v - lo) / (hi - lo)))
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

// ─── Materials ─────────────────────────────────────────────────────────────
const mRed    = new THREE.MeshStandardMaterial({ color: '#CC0000', metalness: 0.35, roughness: 0.18, envMapIntensity: 2.0 })
const mCarbon = new THREE.MeshStandardMaterial({ color: '#0d0d0d', metalness: 0.25, roughness: 0.50, envMapIntensity: 1.2 })
const mWhite  = new THREE.MeshStandardMaterial({ color: '#EFEFEF', metalness: 0.08, roughness: 0.28 })
const mGold   = new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.7, roughness: 0.18, emissive: '#3a2900', emissiveIntensity: 0.3 })
const mDark   = new THREE.MeshStandardMaterial({ color: '#040404', metalness: 0.05, roughness: 0.85 })
const mDarkC  = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.40, roughness: 0.35, envMapIntensity: 1.5 })
const mTyre   = new THREE.MeshStandardMaterial({ color: '#181818', metalness: 0.0, roughness: 0.96 })
const mRim    = new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.88, roughness: 0.12 })

// ─── Wheel (single) ────────────────────────────────────────────────────────
function Wheel({ pos, front }) {
  const spinRef = useRef()
  const r = front ? 0.30 : 0.345
  const w = front ? 0.28 : 0.38

  useFrame((_, dt) => {
    const s = useExperienceStore.getState().scrollProgress
    const speed = norm(s, 0.55, 0.80) * 30
    if (spinRef.current) spinRef.current.rotation.x -= speed * dt
  })

  return (
    <group position={pos}>
      <group ref={spinRef} rotation={[0, 0, Math.PI / 2]}>
        {/* Tyre */}
        <mesh material={mTyre}>
          <torusGeometry args={[r, w * 0.42, 16, 32]} />
        </mesh>
        {/* Rim */}
        <mesh material={mRim}>
          <cylinderGeometry args={[r * 0.65, r * 0.65, w * 0.82, 16]} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} material={mRim} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
            <boxGeometry args={[r * 0.08, r * 1.15, w * 0.12]} />
          </mesh>
        ))}
        {/* Brake disc */}
        <mesh material={mCarbon} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[r * 0.5, r * 0.5, w * 0.15, 16]} />
        </mesh>
      </group>
    </group>
  )
}

// ─── Car (full assembled — realistic geometry) ────────────────────────────
function CarFull({ groupRef }) {
  return (
    <group ref={groupRef}>

      {/* ── NOSE CONE — tapered cylinders ── */}
      <mesh material={mWhite} position={[0, 0.015, 3.62]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.036, 0.48, 10]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.018, 3.13]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.036, 0.072, 0.58, 10]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.022, 2.55]} rotation={[-Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.072, 0.130, 0.64, 10]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.035, 2.10]}>
        <boxGeometry args={[0.33, 0.135, 0.55]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.06, 1.82]}>
        <boxGeometry args={[0.42, 0.155, 0.28]} />
      </mesh>

      {/* ── MONOCOQUE ── */}
      <mesh material={mRed} position={[0, 0.080, 0.45]}>
        <boxGeometry args={[0.52, 0.145, 2.80]} />
      </mesh>
      <mesh material={mRed} position={[0.28, 0.180, 0.45]} rotation={[0, 0, 0.32]}>
        <boxGeometry args={[0.05, 0.155, 2.60]} />
      </mesh>
      <mesh material={mRed} position={[-0.28, 0.180, 0.45]} rotation={[0, 0, -0.32]}>
        <boxGeometry args={[0.05, 0.155, 2.60]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.225, 0.45]}>
        <boxGeometry args={[0.36, 0.065, 2.60]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.080, -1.50]}>
        <boxGeometry args={[0.44, 0.138, 0.55]} />
      </mesh>

      {/* ── COCKPIT ── */}
      <mesh material={mDarkC} position={[0, 0.265, 0.70]}>
        <boxGeometry args={[0.50, 0.075, 0.50]} />
      </mesh>
      <mesh material={mDark} position={[0, 0.235, 0.72]}>
        <boxGeometry args={[0.30, 0.055, 0.38]} />
      </mesh>
      <mesh material={mDarkC} position={[ 0.26, 0.26, 0.68]}>
        <boxGeometry args={[0.04, 0.12, 0.48]} />
      </mesh>
      <mesh material={mDarkC} position={[-0.26, 0.26, 0.68]}>
        <boxGeometry args={[0.04, 0.12, 0.48]} />
      </mesh>
      <mesh material={mRed} position={[0, 0.305, 0.35]}>
        <boxGeometry args={[0.20, 0.085, 0.26]} />
      </mesh>
      <mesh material={mDarkC} position={[0, 0.240, 0.96]}>
        <boxGeometry args={[0.52, 0.22, 0.055]} />
      </mesh>

      {/* ── ROLL HOOP & AIRBOX ── */}
      <mesh material={mRed} position={[0, 0.360, -0.02]}>
        <boxGeometry args={[0.34, 0.30, 0.42]} />
      </mesh>
      <mesh material={mDarkC} position={[0, 0.58, -0.06]}>
        <boxGeometry args={[0.20, 0.38, 0.32]} />
      </mesh>
      <mesh material={mDark} position={[0, 0.575, 0.13]}>
        <boxGeometry args={[0.13, 0.08, 0.04]} />
      </mesh>

      {/* ── ENGINE COVER ── */}
      <mesh material={mRed} position={[0, 0.205, -0.72]}>
        <boxGeometry args={[0.46, 0.285, 1.45]} />
      </mesh>
      <mesh material={mRed} position={[ 0.24, 0.285, -0.72]} rotation={[0, 0, 0.28]}>
        <boxGeometry args={[0.05, 0.22, 1.40]} />
      </mesh>
      <mesh material={mRed} position={[-0.24, 0.285, -0.72]} rotation={[0, 0, -0.28]}>
        <boxGeometry args={[0.05, 0.22, 1.40]} />
      </mesh>
      <mesh material={mDarkC} position={[0, 0.545, -0.68]}>
        <boxGeometry args={[0.028, 0.32, 0.78]} />
      </mesh>

      {/* ── SIDEPODS ── */}
      <mesh material={mRed} position={[ 0.46, 0.135, 0.14]}>
        <boxGeometry args={[0.325, 0.230, 1.95]} />
      </mesh>
      <mesh material={mRed} position={[ 0.46, 0.262, 0.14]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.05, 0.15, 1.90]} />
      </mesh>
      <mesh material={mDarkC} position={[ 0.52, 0.040, 0.20]} rotation={[0, 0, -0.30]}>
        <boxGeometry args={[0.06, 0.08, 1.60]} />
      </mesh>
      <mesh material={mDark} position={[ 0.57, 0.148, 0.92]}>
        <boxGeometry args={[0.06, 0.170, 0.45]} />
      </mesh>
      <mesh material={mDarkC} position={[ 0.555, 0.150, 1.17]}>
        <boxGeometry args={[0.075, 0.18, 0.055]} />
      </mesh>
      <mesh material={mRed} position={[ 0.40, 0.12, -0.90]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.24, 0.195, 0.50]} />
      </mesh>
      {/* Right sidepod */}
      <mesh material={mRed} position={[-0.46, 0.135, 0.14]}>
        <boxGeometry args={[0.325, 0.230, 1.95]} />
      </mesh>
      <mesh material={mRed} position={[-0.46, 0.262, 0.14]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[0.05, 0.15, 1.90]} />
      </mesh>
      <mesh material={mDarkC} position={[-0.52, 0.040, 0.20]} rotation={[0, 0, 0.30]}>
        <boxGeometry args={[0.06, 0.08, 1.60]} />
      </mesh>
      <mesh material={mDark} position={[-0.57, 0.148, 0.92]}>
        <boxGeometry args={[0.06, 0.170, 0.45]} />
      </mesh>
      <mesh material={mDarkC} position={[-0.555, 0.150, 1.17]}>
        <boxGeometry args={[0.075, 0.18, 0.055]} />
      </mesh>
      <mesh material={mRed} position={[-0.40, 0.12, -0.90]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[0.24, 0.195, 0.50]} />
      </mesh>

      {/* ── FLOOR & DIFFUSER ── */}
      <mesh material={mDarkC} position={[0, -0.035, 0.30]}>
        <boxGeometry args={[1.05, 0.030, 3.60]} />
      </mesh>
      <mesh material={mDarkC} position={[ 0.50, -0.025, 0.30]}>
        <boxGeometry args={[0.04, 0.045, 3.20]} />
      </mesh>
      <mesh material={mDarkC} position={[-0.50, -0.025, 0.30]}>
        <boxGeometry args={[0.04, 0.045, 3.20]} />
      </mesh>
      <mesh material={mDarkC} position={[0, 0.042, -1.92]} rotation={[0.30, 0, 0]}>
        <boxGeometry args={[0.82, 0.052, 0.72]} />
      </mesh>
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x, i) => (
        <mesh key={i} material={mDarkC} position={[x, 0.038, -1.88]} rotation={[0.30, 0, 0]}>
          <boxGeometry args={[0.025, 0.18, 0.68]} />
        </mesh>
      ))}

      {/* ── HALO ── */}
      <mesh material={mGold} position={[0, 0.495, 0.65]}>
        <torusGeometry args={[0.215, 0.026, 8, 24, Math.PI]} />
      </mesh>
      <mesh material={mGold} position={[0, 0.390, 0.90]}>
        <cylinderGeometry args={[0.024, 0.024, 0.235, 8]} />
      </mesh>

      {/* ── FRONT WING ── */}
      <group position={[0, -0.10, 3.32]}>
        <mesh material={mRed}><boxGeometry args={[2.12, 0.044, 0.56]} /></mesh>
        <mesh material={mRed} position={[0, 0.065, -0.19]} rotation={[-0.17, 0, 0]}><boxGeometry args={[1.82, 0.036, 0.32]} /></mesh>
        <mesh material={mRed} position={[0, 0.125, -0.33]} rotation={[-0.24, 0, 0]}><boxGeometry args={[1.42, 0.030, 0.26]} /></mesh>
        <mesh material={mRed} position={[0, 0.182, -0.43]} rotation={[-0.30, 0, 0]}><boxGeometry args={[0.96, 0.026, 0.20]} /></mesh>
        {[-1, 1].map((s, i) => (
          <group key={i}>
            <mesh material={mCarbon} position={[s * 1.07, 0.08, -0.05]}><boxGeometry args={[0.032, 0.32, 0.66]} /></mesh>
            <mesh material={mCarbon} position={[s * 0.92, 0.042, 0.22]} rotation={[0, s * 0.28, s * 0.12]}><boxGeometry args={[0.16, 0.022, 0.24]} /></mesh>
          </group>
        ))}
        {[-1, 1].map((s, i) => (
          <mesh key={i} material={mCarbon} position={[s * 0.32, 0.16, 0.10]} rotation={[0.20, 0, s * 0.04]}>
            <boxGeometry args={[0.030, 0.14, 0.30]} />
          </mesh>
        ))}
      </group>

      {/* ── REAR WING ── */}
      <group position={[0, 0.76, -1.98]}>
        <mesh material={mRed}><boxGeometry args={[1.06, 0.050, 0.42]} /></mesh>
        <mesh material={mRed} position={[0, 0.068, 0.08]} rotation={[-0.12, 0, 0]}><boxGeometry args={[0.98, 0.038, 0.24]} /></mesh>
        {[-1, 1].map((s, i) => (
          <mesh key={i} material={mCarbon} position={[s * 0.55, 0.04, 0.04]}><boxGeometry args={[0.036, 0.22, 0.52]} /></mesh>
        ))}
        <mesh material={mCarbon} position={[0, -0.24, 0.06]}><boxGeometry args={[0.80, 0.028, 0.24]} /></mesh>
        {[-1, 1].map((s, i) => (
          <group key={i}>
            <mesh material={mCarbon} position={[s * 0.22, -0.18, 0.02]} rotation={[0.10, 0, s * 0.08]}>
              <cylinderGeometry args={[0.024, 0.020, 0.38, 8]} />
            </mesh>
            <mesh material={mCarbon} position={[s * 0.24, -0.42, 0.02]} rotation={[0.04, 0, s * 0.14]}>
              <cylinderGeometry args={[0.022, 0.018, 0.40, 8]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── SUSPENSION — proper A-arms ── */}
      {[1, -1].map((side, i) => (
        <group key={i}>
          <mesh material={mDarkC} position={[side * 0.42, 0.13, 1.80]} rotation={[0, side * 0.22, side * 0.14]}>
            <cylinderGeometry args={[0.014, 0.014, 0.40, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.42, 0.13, 1.62]} rotation={[0, -side * 0.22, side * 0.14]}>
            <cylinderGeometry args={[0.014, 0.014, 0.40, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.44, 0.00, 1.80]} rotation={[0, side * 0.18, -side * 0.10]}>
            <cylinderGeometry args={[0.013, 0.013, 0.38, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.44, 0.00, 1.62]} rotation={[0, -side * 0.18, -side * 0.10]}>
            <cylinderGeometry args={[0.013, 0.013, 0.38, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.44, 0.13, -1.35]} rotation={[0, side * 0.20, side * 0.12]}>
            <cylinderGeometry args={[0.014, 0.014, 0.44, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.44, 0.13, -1.53]} rotation={[0, -side * 0.20, side * 0.12]}>
            <cylinderGeometry args={[0.014, 0.014, 0.44, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.46, 0.00, -1.35]} rotation={[0, side * 0.16, -side * 0.08]}>
            <cylinderGeometry args={[0.013, 0.013, 0.42, 6]} />
          </mesh>
          <mesh material={mDarkC} position={[side * 0.46, 0.00, -1.53]} rotation={[0, -side * 0.16, -side * 0.08]}>
            <cylinderGeometry args={[0.013, 0.013, 0.42, 6]} />
          </mesh>
        </group>
      ))}

      {/* ── LIVERY ── */}
      <mesh material={mGold} position={[0, 0.233, 0.45]}>
        <boxGeometry args={[0.525, 0.010, 2.75]} />
      </mesh>

      {/* Wheels */}
      <Wheel pos={[ 0.76, 0, 1.68]} front={true} />
      <Wheel pos={[-0.76, 0, 1.68]} front={true} />
      <Wheel pos={[ 0.86, 0, -1.44]} front={false} />
      <Wheel pos={[-0.86, 0, -1.44]} front={false} />
    </group>
  )
}

// ─── Assembly Parts (section 1) ────────────────────────────────────────────
const PART_DEFS = [
  { name: 'chassis',     startAt: 0.000 },
  { name: 'monocoque',   startAt: 0.020 },
  { name: 'frontWing',   startAt: 0.040 },
  { name: 'rearWing',    startAt: 0.060 },
  { name: 'suspension',  startAt: 0.075 },
  { name: 'wheels',      startAt: 0.090 },
  { name: 'sidepods',    startAt: 0.110 },
  { name: 'halo',        startAt: 0.130 },
  { name: 'engineCover', startAt: 0.150 },
  { name: 'livery',      startAt: 0.165 },
]

function AssemblyPart({ def, children }) {
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    const s = useExperienceStore.getState().scrollProgress
    const t = easeOut(norm(s, def.startAt, def.startAt + 0.025))
    ref.current.scale.setScalar(lerp(0.001, 1, t))
    ref.current.position.y = lerp(3, 0, t)
    ref.current.visible = t > 0.01
  })

  return <group ref={ref} scale={0.001}>{children}</group>
}

function AssemblyScene() {
  return (
    <group>
      <AssemblyPart def={PART_DEFS[0]}>
        <mesh material={mCarbon}>
          <boxGeometry args={[0.50, 0.155, 3.0]} />
        </mesh>
        <mesh material={mCarbon} position={[0, -0.10, 0]}>
          <boxGeometry args={[1.40, 0.025, 3.20]} />
        </mesh>
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[1]}>
        <mesh material={mWhite} position={[0, 0.015, 3.62]} rotation={[-Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.036, 0.48, 10]} />
        </mesh>
        <mesh material={mRed} position={[0, 0.018, 3.13]} rotation={[-Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.036, 0.072, 0.58, 10]} />
        </mesh>
        <mesh material={mRed} position={[0, 0.022, 2.55]} rotation={[-Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.072, 0.130, 0.64, 10]} />
        </mesh>
        <mesh material={mRed} position={[0, 0.035, 2.10]}>
          <boxGeometry args={[0.33, 0.135, 0.55]} />
        </mesh>
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[2]}>
        <group position={[0, -0.06, 3.28]}>
          <mesh material={mRed}><boxGeometry args={[2.05, 0.048, 0.52]} /></mesh>
          <mesh material={mRed} position={[0, 0.07, -0.18]} rotation={[-0.16, 0, 0]}><boxGeometry args={[1.72, 0.038, 0.30]} /></mesh>
          <mesh material={mRed} position={[0, 0.13, -0.30]} rotation={[-0.24, 0, 0]}><boxGeometry args={[1.30, 0.032, 0.24]} /></mesh>
          {[-1, 1].map((s, i) => <mesh key={i} material={mCarbon} position={[s * 1.04, 0.07, -0.06]}><boxGeometry args={[0.035, 0.28, 0.62]} /></mesh>)}
        </group>
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[3]}>
        <group position={[0, 0.72, -1.96]}>
          <mesh material={mRed}><boxGeometry args={[1.00, 0.052, 0.40]} /></mesh>
          <mesh material={mRed} position={[0, 0.07, 0.08]} rotation={[-0.10, 0, 0]}><boxGeometry args={[0.92, 0.040, 0.22]} /></mesh>
          {[-1, 1].map((s, i) => <mesh key={i} material={mCarbon} position={[s * 0.53, 0.04, 0.04]}><boxGeometry args={[0.038, 0.20, 0.50]} /></mesh>)}
          {[-1, 1].map((s, i) => <mesh key={i} material={mCarbon} position={[s * 0.22, -0.34, 0.02]} rotation={[0.06, 0, s * 0.12]}><cylinderGeometry args={[0.024, 0.020, 0.72, 8]} /></mesh>)}
        </group>
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[4]}>
        {[1, -1].map((side, i) => (
          <group key={i}>
            <mesh material={mCarbon} position={[side * 0.62, -0.02, 1.65]} rotation={[0, 0, side * 0.15]}>
              <cylinderGeometry args={[0.018, 0.018, 0.32, 6]} />
            </mesh>
            <mesh material={mCarbon} position={[side * 0.62, -0.02, -1.44]} rotation={[0, 0, side * 0.15]}>
              <cylinderGeometry args={[0.018, 0.018, 0.32, 6]} />
            </mesh>
          </group>
        ))}
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[5]}>
        {[[ 0.76, 0, 1.65, true],[-0.76, 0, 1.65, true],[ 0.84, 0,-1.44, false],[-0.84, 0,-1.44, false]].map(([x, y, z, fr], i) => {
          const r = fr ? 0.30 : 0.345; const w = fr ? 0.28 : 0.38
          return (
            <group key={i} position={[x, y, z]}>
              <group rotation={[0, 0, Math.PI/2]}>
                <mesh material={mTyre}><torusGeometry args={[r, w * 0.42, 16, 32]} /></mesh>
                <mesh material={mRim}><cylinderGeometry args={[r * 0.65, r * 0.65, w * 0.82, 16]} /></mesh>
              </group>
            </group>
          )
        })}
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[6]}>
        {[1, -1].map((s, i) => (
          <group key={i}>
            <mesh material={mRed} position={[s * 0.56, 0.04, 0.12]}><boxGeometry args={[0.28, 0.26, 1.80]} /></mesh>
            <mesh material={mCarbon} position={[s * 0.70, 0.06, 0.74]}><boxGeometry args={[0.06, 0.18, 0.60]} /></mesh>
          </group>
        ))}
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[7]}>
        <mesh material={mGold} position={[0, 0.30, 0.55]} rotation={[0, 0, Math.PI/2]}>
          <torusGeometry args={[0.38, 0.030, 8, 24, Math.PI]} />
        </mesh>
        <mesh material={mGold} position={[0, 0.38, 0.10]}><boxGeometry args={[0.035, 0.22, 0.08]} /></mesh>
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[8]}>
        <mesh material={mRed} position={[0, 0.25, -0.4]}><boxGeometry args={[0.28, 0.30, 1.50]} /></mesh>
        <mesh material={mCarbon} position={[0, 0.44, 0.10]}><boxGeometry args={[0.22, 0.12, 0.40]} /></mesh>
      </AssemblyPart>

      <AssemblyPart def={PART_DEFS[9]}>
        {/* Yellow livery stripe */}
        <mesh material={mGold} position={[0, 0.085, 0.60]}><boxGeometry args={[0.505, 0.012, 1.80]} /></mesh>
        <mesh material={mWhite} position={[0, 0.09, -0.50]}><boxGeometry args={[0.505, 0.010, 0.60]} /></mesh>
      </AssemblyPart>
    </group>
  )
}

// ─── Track / Environment (racing) ─────────────────────────────────────────
function Track() {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const s = useExperienceStore.getState().scrollProgress
    const t = norm(s, 0.60, 0.80)
    // Scroll the track texture offset for motion illusion
    ref.current.material.map && (ref.current.material.map.offset.z = t * 40)
  })

  const trackMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.1,
    roughness: 0.9,
  }), [])

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]} material={trackMat}>
      <planeGeometry args={[12, 120, 1, 60]} />
    </mesh>
  )
}

// ─── Spark Particles (section 5) ──────────────────────────────────────────
function Sparks() {
  const COUNT = 200
  const posRef = useRef()
  const velRef = useRef(new Float32Array(COUNT * 3))
  const ageRef = useRef(new Float32Array(COUNT))

  const positions = useMemo(() => new Float32Array(COUNT * 3), [])
  const colors = useMemo(() => new Float32Array(COUNT * 3), [])

  // Init velocities
  useMemo(() => {
    for (let i = 0; i < COUNT; i++) {
      velRef.current[i * 3 + 0] = (Math.random() - 0.5) * 2.0
      velRef.current[i * 3 + 1] = -Math.random() * 2.5
      velRef.current[i * 3 + 2] = Math.random() * 1.5 + 0.5
      ageRef.current[i] = Math.random()
    }
  }, [])

  const ORIGINS = [
    [ 0.76, -0.30,  1.65],
    [-0.76, -0.30,  1.65],
    [ 0.84, -0.34, -1.44],
    [-0.84, -0.34, -1.44],
  ]

  useFrame((_, dt) => {
    const s = useExperienceStore.getState().scrollProgress
    const intensity = norm(s, 0.80, 0.95)
    if (!posRef.current || intensity < 0.01) return

    const pos = posRef.current.geometry.attributes.position.array
    const col = posRef.current.geometry.attributes.color.array

    for (let i = 0; i < COUNT; i++) {
      ageRef.current[i] += dt * (1.5 + Math.random() * 0.5)
      if (ageRef.current[i] > 1) {
        // Respawn
        ageRef.current[i] = 0
        const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)]
        pos[i * 3 + 0] = origin[0] + (Math.random() - 0.5) * 0.1
        pos[i * 3 + 1] = origin[1]
        pos[i * 3 + 2] = origin[2]
        velRef.current[i * 3 + 0] = (Math.random() - 0.5) * 2.0
        velRef.current[i * 3 + 1] = -Math.random() * 2.5 - 0.5
        velRef.current[i * 3 + 2] = Math.random() * 1.5
      } else {
        pos[i * 3 + 0] += velRef.current[i * 3 + 0] * dt * intensity
        pos[i * 3 + 1] += velRef.current[i * 3 + 1] * dt * intensity
        pos[i * 3 + 2] += velRef.current[i * 3 + 2] * dt * intensity
        velRef.current[i * 3 + 1] -= 4 * dt // gravity
      }

      const life = 1 - ageRef.current[i]
      col[i * 3 + 0] = lerp(1.0, 0.8, ageRef.current[i])   // R
      col[i * 3 + 1] = lerp(0.8, 0.1, ageRef.current[i])   // G
      col[i * 3 + 2] = lerp(0.1, 0.0, ageRef.current[i])   // B
    }

    posRef.current.geometry.attributes.position.needsUpdate = true
    posRef.current.geometry.attributes.color.needsUpdate = true
    posRef.current.material.opacity = intensity * 0.9
  })

  return (
    <points ref={posRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Lighting ──────────────────────────────────────────────────────────────
function SceneLights() {
  const headL = useRef()
  const headR = useRef()
  const keyRef = useRef()
  const ambRef = useRef()

  useFrame(() => {
    const s = useExperienceStore.getState().scrollProgress

    // Assembly: neutral lighting
    const assemblyAmt = 1 - norm(s, 0.18, 0.22)
    // Reveal: lights ramp up
    const revealAmt = norm(s, 0.20, 0.38)
    // Showcase: studio lighting full
    const showcaseAmt = norm(s, 0.38, 0.42)
    // Racing: dynamic
    const racingAmt = norm(s, 0.58, 0.62)

    if (ambRef.current) {
      ambRef.current.intensity = lerp(0.05, 0.4, Math.max(revealAmt, assemblyAmt * 0.6))
    }
    if (keyRef.current) {
      keyRef.current.intensity = lerp(0.0, 2.5, Math.max(revealAmt, assemblyAmt * 0.8))
    }
    if (headL.current && headR.current) {
      const hi = norm(s, 0.22, 0.40) * 12
      headL.current.intensity = hi
      headR.current.intensity = hi
    }
  })

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.3} />
      <directionalLight
        ref={keyRef}
        position={[4, 8, 4]}
        intensity={1.5}
        castShadow
        color="#ffffff"
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.8} color="#4488ff" />
      <directionalLight position={[0, -2, 3]} intensity={0.4} color="#ff3322" />
      {/* Headlights */}
      <pointLight ref={headL} position={[0.4, 0.0, 3.6]} intensity={0} color="#ffffff" distance={8} />
      <pointLight ref={headR} position={[-0.4, 0.0, 3.6]} intensity={0} color="#ffffff" distance={8} />
      {/* Rim light */}
      <pointLight position={[0, 2, -4]} intensity={1.0} color="#E8002D" distance={10} />
    </>
  )
}

// ─── Camera Rig ────────────────────────────────────────────────────────────
function CameraRig() {
  useFrame(({ camera }) => {
    const s = useExperienceStore.getState().scrollProgress

    let tx = 0, ty = 1.2, tz = 7
    let lx = 0, ly = 0, lz = 0

    if (s < 0.20) {
      // Assembly — wide front view
      const t = norm(s, 0, 0.20)
      tx = lerp(0, 1.5, t * 0.3)
      ty = lerp(2.5, 1.5, t)
      tz = lerp(9, 7, t)
    } else if (s < 0.40) {
      // Reveal — slow orbit
      const t = norm(s, 0.20, 0.40)
      const angle = t * Math.PI * 0.5
      tx = Math.sin(angle) * 5.5
      ty = 1.2
      tz = Math.cos(angle) * 5.5
    } else if (s < 0.60) {
      // 360° showcase — orbit
      const t = norm(s, 0.40, 0.60)
      const angle = t * Math.PI * 2
      tx = Math.sin(angle) * 6
      ty = 1.0 + Math.sin(t * Math.PI) * 0.8
      tz = Math.cos(angle) * 6
    } else if (s < 0.80) {
      // Racing — fly forward
      const t = norm(s, 0.60, 0.80)
      const ease = easeOut(t)
      tx = 0
      ty = lerp(1.2, 0.4, ease)
      tz = lerp(7, 3.5, ease)
      lz = lerp(0, -8, ease)
      ly = lerp(0, 0.2, ease)
    } else {
      // Sparks / hero — rear quarter view
      const t = norm(s, 0.80, 1.0)
      const angle = lerp(0.3, 0.8, t)
      tx = Math.sin(angle) * 5
      ty = 1.0
      tz = Math.cos(angle) * 5
    }

    camera.position.x += (tx - camera.position.x) * 0.04
    camera.position.y += (ty - camera.position.y) * 0.04
    camera.position.z += (tz - camera.position.z) * 0.04
    camera.lookAt(lx, ly, lz)
  })
  return null
}

// ─── Full-car visibility toggle ────────────────────────────────────────────
function CarVisibilityGroup({ children }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const s = useExperienceStore.getState().scrollProgress
    // Hide assembly scene when full car is shown
    ref.current.visible = s >= 0.18
  })
  return <group ref={ref}>{children}</group>
}

function AssemblyVisibilityGroup({ children }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const s = useExperienceStore.getState().scrollProgress
    ref.current.visible = s < 0.22
  })
  return <group ref={ref}>{children}</group>
}

// ─── Speed Lines (canvas overlay) ─────────────────────────────────────────
function SpeedLinesOverlay() {
  // Handled via CSS/canvas overlay in Experience.jsx
  return null
}

// ─── Scene Root ────────────────────────────────────────────────────────────
function Scene() {
  const carRef = useRef()

  useFrame(() => {
    if (!carRef.current) return
    const s = useExperienceStore.getState().scrollProgress

    // 360° rotation in showcase section
    if (s >= 0.40 && s < 0.60) {
      const t = norm(s, 0.40, 0.60)
      carRef.current.rotation.y = t * Math.PI * 2
    } else if (s >= 0.60) {
      const baseRot = Math.PI * 2
      const tilt = norm(s, 0.60, 0.80) * 0.06
      carRef.current.rotation.y = lerp(baseRot, baseRot, 0.1)
      carRef.current.rotation.z = tilt
    } else {
      carRef.current.rotation.y += (0 - carRef.current.rotation.y) * 0.05
      carRef.current.rotation.z += (0 - carRef.current.rotation.z) * 0.05
    }
  })

  return (
    <>
      <CameraRig />
      <SceneLights />
      <Track />

      {/* Assembly parts (visible during assembly) */}
      <AssemblyVisibilityGroup>
        <AssemblyScene />
      </AssemblyVisibilityGroup>

      {/* Full car (visible from 18%+) */}
      <CarVisibilityGroup>
        <CarFull groupRef={carRef} />
      </CarVisibilityGroup>

      <Sparks />
    </>
  )
}

// ─── Export ────────────────────────────────────────────────────────────────
export default function ExperienceCanvas() {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 200, position: [0, 2.5, 9] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      shadows
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <Scene />
    </Canvas>
  )
}
