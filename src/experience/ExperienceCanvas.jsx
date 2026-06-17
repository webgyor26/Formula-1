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
const mRed    = new THREE.MeshStandardMaterial({ color: '#CC0000', metalness: 0.3, roughness: 0.25 })
const mCarbon = new THREE.MeshStandardMaterial({ color: '#111111', metalness: 0.2, roughness: 0.55 })
const mWhite  = new THREE.MeshStandardMaterial({ color: '#F0F0F0', metalness: 0.1, roughness: 0.3 })
const mGold   = new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 0.7, roughness: 0.2, emissive: '#3a2900', emissiveIntensity: 0.3 })
const mGlass  = new THREE.MeshStandardMaterial({ color: '#88AADD', metalness: 0.8, roughness: 0.1, transparent: true, opacity: 0.7 })
const mTyre   = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.0, roughness: 0.95 })
const mRim    = new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.85, roughness: 0.15 })

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

// ─── Car (full assembled) ──────────────────────────────────────────────────
function CarFull({ groupRef }) {
  return (
    <group ref={groupRef}>
      {/* Chassis */}
      <mesh material={mCarbon} position={[0, 0, 0]}>
        <boxGeometry args={[0.50, 0.155, 3.0]} />
      </mesh>

      {/* Nose step 1 */}
      <mesh material={mRed} position={[0, -0.01, 1.60]}>
        <boxGeometry args={[0.32, 0.10, 0.80]} />
      </mesh>
      {/* Nose step 2 */}
      <mesh material={mRed} position={[0, -0.03, 2.12]}>
        <boxGeometry args={[0.22, 0.075, 0.58]} />
      </mesh>
      {/* Nose tip */}
      <mesh material={mWhite} position={[0, -0.045, 2.55]}>
        <boxGeometry args={[0.10, 0.055, 0.50]} />
      </mesh>

      {/* Engine cover / airbox */}
      <mesh material={mRed} position={[0, 0.25, -0.4]}>
        <boxGeometry args={[0.28, 0.30, 1.50]} />
      </mesh>
      {/* Airbox intake */}
      <mesh material={mCarbon} position={[0, 0.44, 0.10]}>
        <boxGeometry args={[0.22, 0.12, 0.40]} />
      </mesh>

      {/* Sidepod L */}
      <mesh material={mRed} position={[0.56, 0.04, 0.12]}>
        <boxGeometry args={[0.28, 0.26, 1.80]} />
      </mesh>
      {/* Sidepod inlet L */}
      <mesh material={mCarbon} position={[0.70, 0.06, 0.74]}>
        <boxGeometry args={[0.06, 0.18, 0.60]} />
      </mesh>
      {/* Sidepod R */}
      <mesh material={mRed} position={[-0.56, 0.04, 0.12]}>
        <boxGeometry args={[0.28, 0.26, 1.80]} />
      </mesh>
      {/* Sidepod inlet R */}
      <mesh material={mCarbon} position={[-0.70, 0.06, 0.74]}>
        <boxGeometry args={[0.06, 0.18, 0.60]} />
      </mesh>

      {/* Floor */}
      <mesh material={mCarbon} position={[0, -0.10, 0.0]}>
        <boxGeometry args={[1.40, 0.025, 3.20]} />
      </mesh>
      {/* Diffuser */}
      <mesh material={mCarbon} position={[0, -0.05, -1.62]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[1.10, 0.06, 0.55]} />
      </mesh>
      {[-1, 1].map((side, i) => (
        <mesh key={i} material={mCarbon} position={[side * 0.38, -0.08, -1.55]}>
          <boxGeometry args={[0.04, 0.18, 0.52]} />
        </mesh>
      ))}

      {/* Halo */}
      <mesh material={mGold} position={[0, 0.30, 0.55]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.030, 8, 24, Math.PI]} />
      </mesh>
      <mesh material={mGold} position={[0, 0.38, 0.10]}>
        <boxGeometry args={[0.035, 0.22, 0.08]} />
      </mesh>

      {/* Front wing */}
      <group position={[0, -0.06, 3.28]}>
        <mesh material={mRed}>
          <boxGeometry args={[2.05, 0.048, 0.52]} />
        </mesh>
        <mesh material={mRed} position={[0, 0.07, -0.18]} rotation={[-0.16, 0, 0]}>
          <boxGeometry args={[1.72, 0.038, 0.30]} />
        </mesh>
        <mesh material={mRed} position={[0, 0.13, -0.30]} rotation={[-0.24, 0, 0]}>
          <boxGeometry args={[1.30, 0.032, 0.24]} />
        </mesh>
        {[-1, 1].map((s, i) => (
          <mesh key={i} material={mCarbon} position={[s * 1.04, 0.07, -0.06]}>
            <boxGeometry args={[0.035, 0.28, 0.62]} />
          </mesh>
        ))}
      </group>

      {/* Rear wing */}
      <group position={[0, 0.72, -1.96]}>
        <mesh material={mRed}>
          <boxGeometry args={[1.00, 0.052, 0.40]} />
        </mesh>
        <mesh material={mRed} position={[0, 0.07, 0.08]} rotation={[-0.10, 0, 0]}>
          <boxGeometry args={[0.92, 0.040, 0.22]} />
        </mesh>
        {[-1, 1].map((s, i) => (
          <mesh key={i} material={mCarbon} position={[s * 0.53, 0.04, 0.04]}>
            <boxGeometry args={[0.038, 0.20, 0.50]} />
          </mesh>
        ))}
        {[-1, 1].map((s, i) => (
          <mesh key={i} material={mCarbon} position={[s * 0.22, -0.34, 0.02]} rotation={[0.06, 0, s * 0.12]}>
            <cylinderGeometry args={[0.024, 0.020, 0.72, 8]} />
          </mesh>
        ))}
      </group>

      {/* Suspension arms */}
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

      {/* Wheels */}
      <Wheel pos={[ 0.76, 0, 1.65]} front={true} />
      <Wheel pos={[-0.76, 0, 1.65]} front={true} />
      <Wheel pos={[ 0.84, 0, -1.44]} front={false} />
      <Wheel pos={[-0.84, 0, -1.44]} front={false} />
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
        <mesh material={mRed} position={[0, -0.01, 1.60]}>
          <boxGeometry args={[0.32, 0.10, 0.80]} />
        </mesh>
        <mesh material={mRed} position={[0, -0.03, 2.12]}>
          <boxGeometry args={[0.22, 0.075, 0.58]} />
        </mesh>
        <mesh material={mWhite} position={[0, -0.045, 2.55]}>
          <boxGeometry args={[0.10, 0.055, 0.50]} />
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
