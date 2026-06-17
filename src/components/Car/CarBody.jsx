import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'

export function useCarMaterials() {
  return useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: '#CC0000', metalness: 0.35, roughness: 0.18, envMapIntensity: 2.0,
    })
    const carbon = new THREE.MeshStandardMaterial({
      color: '#0d0d0d', metalness: 0.25, roughness: 0.50, envMapIntensity: 1.2,
    })
    const chrome = new THREE.MeshStandardMaterial({
      color: '#C8C8C8', metalness: 0.97, roughness: 0.04, envMapIntensity: 3.0,
    })
    const glow = new THREE.MeshStandardMaterial({
      color: '#FF4400', emissive: new THREE.Color('#FF2200'), emissiveIntensity: 0, roughness: 0.28,
    })
    const yellow = new THREE.MeshStandardMaterial({ color: '#FFD700', metalness: 0.1, roughness: 0.4 })
    const white = new THREE.MeshStandardMaterial({ color: '#EFEFEF', metalness: 0.08, roughness: 0.28 })
    const black = new THREE.MeshStandardMaterial({ color: '#040404', metalness: 0.05, roughness: 0.85 })
    const darkCarbon = new THREE.MeshStandardMaterial({
      color: '#1a1a1a', metalness: 0.4, roughness: 0.35, envMapIntensity: 1.5,
    })
    return { body, carbon, chrome, glow, yellow, white, black, darkCarbon }
  }, [])
}

export default function CarBody({ materials, engineGlow = 0 }) {
  useFrame(() => {
    if (materials.glow) materials.glow.emissiveIntensity = engineGlow * 4
  })

  const { body, carbon, chrome, glow, yellow, white, black, darkCarbon } = materials

  return (
    <group>

      {/* ══════════════════ NOSE CONE — tapered cylinders ══════════════════ */}
      {/* Tip — very narrow pointed end */}
      <mesh material={white} position={[0, 0.015, 3.62]} rotation={[-Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.036, 0.48, 10]} />
      </mesh>
      {/* Nose tube 1 */}
      <mesh material={body} position={[0, 0.018, 3.13]} rotation={[-Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.072, 0.58, 10]} />
      </mesh>
      {/* Nose tube 2 */}
      <mesh material={body} position={[0, 0.022, 2.55]} rotation={[-Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.072, 0.130, 0.64, 10]} />
      </mesh>
      {/* Nose shoulder — square cross-section transition */}
      <mesh material={body} position={[0, 0.035, 2.10]} castShadow>
        <boxGeometry args={[0.33, 0.135, 0.55]} />
      </mesh>
      {/* Nose-to-chassis fillet */}
      <mesh material={body} position={[0, 0.06, 1.82]} castShadow>
        <boxGeometry args={[0.42, 0.155, 0.28]} />
      </mesh>

      {/* ══════════════════ MAIN MONOCOQUE ══════════════════ */}
      {/* Central tub — lower section */}
      <mesh material={body} position={[0, 0.080, 0.45]} castShadow>
        <boxGeometry args={[0.52, 0.145, 2.80]} />
      </mesh>
      {/* Angled body side-L (suggests curved monocoque flank) */}
      <mesh material={body} position={[0.28, 0.180, 0.45]} rotation={[0, 0, 0.32]} castShadow>
        <boxGeometry args={[0.05, 0.155, 2.60]} />
      </mesh>
      {/* Angled body side-R */}
      <mesh material={body} position={[-0.28, 0.180, 0.45]} rotation={[0, 0, -0.32]} castShadow>
        <boxGeometry args={[0.05, 0.155, 2.60]} />
      </mesh>
      {/* Top spine */}
      <mesh material={body} position={[0, 0.225, 0.45]} castShadow>
        <boxGeometry args={[0.36, 0.065, 2.60]} />
      </mesh>
      {/* Rear coke-bottle taper */}
      <mesh material={body} position={[0, 0.080, -1.50]} castShadow>
        <boxGeometry args={[0.44, 0.138, 0.55]} />
      </mesh>

      {/* ══════════════════ COCKPIT ══════════════════ */}
      {/* Surround rim */}
      <mesh material={darkCarbon} position={[0, 0.265, 0.70]} castShadow>
        <boxGeometry args={[0.50, 0.075, 0.50]} />
      </mesh>
      {/* Cockpit opening — deep black hole */}
      <mesh material={black} position={[0, 0.235, 0.72]}>
        <boxGeometry args={[0.30, 0.055, 0.38]} />
      </mesh>
      {/* Cockpit side walls */}
      <mesh material={darkCarbon} position={[ 0.26, 0.26, 0.68]} castShadow>
        <boxGeometry args={[0.04, 0.12, 0.48]} />
      </mesh>
      <mesh material={darkCarbon} position={[-0.26, 0.26, 0.68]} castShadow>
        <boxGeometry args={[0.04, 0.12, 0.48]} />
      </mesh>
      {/* Windscreen (tinted glass) */}
      <mesh material={new THREE.MeshStandardMaterial({ color:'#1a3355', metalness:0.7, roughness:0.05, transparent:true, opacity:0.55 })}
        position={[0, 0.31, 0.98]} rotation={[-0.38, 0, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.22]} />
      </mesh>
      {/* Headrest */}
      <mesh material={body} position={[0, 0.305, 0.35]} castShadow>
        <boxGeometry args={[0.20, 0.085, 0.26]} />
      </mesh>
      {/* Cockpit front bulkhead */}
      <mesh material={darkCarbon} position={[0, 0.240, 0.96]} castShadow>
        <boxGeometry args={[0.52, 0.22, 0.055]} />
      </mesh>

      {/* ══════════════════ ROLL HOOP & AIRBOX ══════════════════ */}
      {/* Roll hoop base */}
      <mesh material={body} position={[0, 0.360, -0.02]} castShadow>
        <boxGeometry args={[0.34, 0.30, 0.42]} />
      </mesh>
      {/* Airbox duct */}
      <mesh material={darkCarbon} position={[0, 0.58, -0.06]} castShadow>
        <boxGeometry args={[0.20, 0.38, 0.32]} />
      </mesh>
      {/* Airbox intake opening */}
      <mesh material={black} position={[0, 0.575, 0.13]}>
        <boxGeometry args={[0.13, 0.08, 0.04]} />
      </mesh>

      {/* ══════════════════ ENGINE COVER ══════════════════ */}
      {/* Main cover */}
      <mesh material={body} position={[0, 0.205, -0.72]} castShadow>
        <boxGeometry args={[0.46, 0.285, 1.45]} />
      </mesh>
      {/* Angled cover sides */}
      <mesh material={body} position={[ 0.24, 0.285, -0.72]} rotation={[0, 0, 0.28]} castShadow>
        <boxGeometry args={[0.05, 0.22, 1.40]} />
      </mesh>
      <mesh material={body} position={[-0.24, 0.285, -0.72]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[0.05, 0.22, 1.40]} />
      </mesh>
      {/* Engine glow slot */}
      <mesh material={glow} position={[0, 0.175, -0.55]}>
        <boxGeometry args={[0.22, 0.08, 0.45]} />
      </mesh>
      {/* Shark fin */}
      <mesh material={darkCarbon} position={[0, 0.545, -0.68]} castShadow>
        <boxGeometry args={[0.028, 0.32, 0.78]} />
      </mesh>

      {/* ══════════════════ SIDEPODS ══════════════════ */}
      {/* Left sidepod — main body */}
      <mesh material={body} position={[ 0.46, 0.135, 0.14]} castShadow>
        <boxGeometry args={[0.325, 0.230, 1.95]} />
      </mesh>
      {/* Left sidepod angled top */}
      <mesh material={body} position={[ 0.46, 0.262, 0.14]} rotation={[0, 0, 0.22]} castShadow>
        <boxGeometry args={[0.05, 0.15, 1.90]} />
      </mesh>
      {/* Left sidepod angled bottom undercut */}
      <mesh material={darkCarbon} position={[ 0.52, 0.040, 0.20]} rotation={[0, 0, -0.30]} castShadow>
        <boxGeometry args={[0.06, 0.08, 1.60]} />
      </mesh>
      {/* Left inlet — large opening with depth */}
      <mesh material={black} position={[ 0.57, 0.148, 0.92]}>
        <boxGeometry args={[0.06, 0.170, 0.45]} />
      </mesh>
      {/* Left inlet lip */}
      <mesh material={darkCarbon} position={[ 0.555, 0.150, 1.17]} castShadow>
        <boxGeometry args={[0.075, 0.18, 0.055]} />
      </mesh>
      {/* Left sidepod rear taper */}
      <mesh material={body} position={[ 0.40, 0.12, -0.90]} rotation={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.24, 0.195, 0.50]} />
      </mesh>

      {/* Right sidepod */}
      <mesh material={body} position={[-0.46, 0.135, 0.14]} castShadow>
        <boxGeometry args={[0.325, 0.230, 1.95]} />
      </mesh>
      <mesh material={body} position={[-0.46, 0.262, 0.14]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[0.05, 0.15, 1.90]} />
      </mesh>
      <mesh material={darkCarbon} position={[-0.52, 0.040, 0.20]} rotation={[0, 0, 0.30]} castShadow>
        <boxGeometry args={[0.06, 0.08, 1.60]} />
      </mesh>
      <mesh material={black} position={[-0.57, 0.148, 0.92]}>
        <boxGeometry args={[0.06, 0.170, 0.45]} />
      </mesh>
      <mesh material={darkCarbon} position={[-0.555, 0.150, 1.17]} castShadow>
        <boxGeometry args={[0.075, 0.18, 0.055]} />
      </mesh>
      <mesh material={body} position={[-0.40, 0.12, -0.90]} rotation={[0, -0.12, 0]} castShadow>
        <boxGeometry args={[0.24, 0.195, 0.50]} />
      </mesh>

      {/* ══════════════════ FLOOR & UNDERSIDE ══════════════════ */}
      <mesh material={darkCarbon} position={[0, -0.035, 0.30]} receiveShadow castShadow>
        <boxGeometry args={[1.05, 0.030, 3.60]} />
      </mesh>
      {/* Venturi tunnels (raised edge) */}
      <mesh material={darkCarbon} position={[ 0.50, -0.025, 0.30]} castShadow>
        <boxGeometry args={[0.04, 0.045, 3.20]} />
      </mesh>
      <mesh material={darkCarbon} position={[-0.50, -0.025, 0.30]} castShadow>
        <boxGeometry args={[0.04, 0.045, 3.20]} />
      </mesh>
      {/* Diffuser — angled */}
      <mesh material={darkCarbon} position={[0, 0.042, -1.92]} rotation={[0.30, 0, 0]} castShadow>
        <boxGeometry args={[0.82, 0.052, 0.72]} />
      </mesh>
      {/* Diffuser fins */}
      {[-0.28, -0.14, 0, 0.14, 0.28].map((x, i) => (
        <mesh key={i} material={darkCarbon} position={[x, 0.038, -1.88]} rotation={[0.30, 0, 0]} castShadow>
          <boxGeometry args={[0.025, 0.18, 0.68]} />
        </mesh>
      ))}

      {/* ══════════════════ HALO ══════════════════ */}
      <mesh material={chrome} position={[0, 0.495, 0.65]} castShadow>
        <torusGeometry args={[0.215, 0.026, 8, 24, Math.PI]} />
      </mesh>
      {/* Halo center pillar */}
      <mesh material={chrome} position={[0, 0.390, 0.90]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.235, 8]} />
      </mesh>

      {/* ══════════════════ SUSPENSION — A-ARMS ══════════════════ */}
      {[1, -1].map((side, i) => (
        <group key={i}>
          {/* Front upper wishbone — two arms of A */}
          <mesh material={darkCarbon} position={[side * 0.42, 0.13, 1.80]} rotation={[0, side * 0.22, side * 0.14]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.40, 6]} />
          </mesh>
          <mesh material={darkCarbon} position={[side * 0.42, 0.13, 1.62]} rotation={[0, -side * 0.22, side * 0.14]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.40, 6]} />
          </mesh>
          {/* Front lower wishbone */}
          <mesh material={darkCarbon} position={[side * 0.44, 0.00, 1.80]} rotation={[0, side * 0.18, -side * 0.10]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.38, 6]} />
          </mesh>
          <mesh material={darkCarbon} position={[side * 0.44, 0.00, 1.62]} rotation={[0, -side * 0.18, -side * 0.10]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.38, 6]} />
          </mesh>
          {/* Pushrod front */}
          <mesh material={darkCarbon} position={[side * 0.48, 0.05, 1.71]} rotation={[0, 0, side * 0.50]} castShadow>
            <cylinderGeometry args={[0.010, 0.010, 0.28, 6]} />
          </mesh>
          {/* Rear upper wishbone */}
          <mesh material={darkCarbon} position={[side * 0.44, 0.13, -1.35]} rotation={[0, side * 0.20, side * 0.12]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.44, 6]} />
          </mesh>
          <mesh material={darkCarbon} position={[side * 0.44, 0.13, -1.53]} rotation={[0, -side * 0.20, side * 0.12]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.44, 6]} />
          </mesh>
          {/* Rear lower wishbone */}
          <mesh material={darkCarbon} position={[side * 0.46, 0.00, -1.35]} rotation={[0, side * 0.16, -side * 0.08]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.42, 6]} />
          </mesh>
          <mesh material={darkCarbon} position={[side * 0.46, 0.00, -1.53]} rotation={[0, -side * 0.16, -side * 0.08]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.42, 6]} />
          </mesh>
          {/* Pull rod rear */}
          <mesh material={darkCarbon} position={[side * 0.50, 0.04, -1.44]} rotation={[0, 0, -side * 0.45]} castShadow>
            <cylinderGeometry args={[0.010, 0.010, 0.30, 6]} />
          </mesh>
        </group>
      ))}

      {/* ══════════════════ WHEEL ARCHES (small lips) ══════════════════ */}
      {[[ 0.72, 1.68], [-0.72, 1.68], [ 0.80, -1.42], [-0.80, -1.42]].map(([x, z], i) => (
        <mesh key={i} material={body} position={[x, 0.13, z]} castShadow>
          <boxGeometry args={[0.055, 0.25, 0.28]} />
        </mesh>
      ))}

      {/* ══════════════════ LIVERY ══════════════════ */}
      {/* Yellow racing stripe */}
      <mesh material={yellow} position={[0, 0.233, 0.45]} castShadow>
        <boxGeometry args={[0.525, 0.010, 2.75]} />
      </mesh>
      {/* Number plate */}
      <mesh material={white} position={[0, 0.04, 2.78]}>
        <boxGeometry args={[0.18, 0.058, 0.055]} />
      </mesh>

    </group>
  )
}
