import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useExperienceStore from './useExperienceStore'

const PARTS = [
  { name: 'chassis',      geo: [4, 0.15, 1.2],  pos: [0, 0, 0],        color: '#1a1a2e' },
  { name: 'monocoque',    geo: [2, 0.3, 0.8],   pos: [0, 0.22, 0],     color: '#16213e' },
  { name: 'front_wing',   geo: [2.2, 0.05, 0.3],pos: [0, 0.05, 1.8],   color: '#E8002D' },
  { name: 'rear_wing',    geo: [1.6, 0.05, 0.2],pos: [0, 0.8, -1.8],   color: '#E8002D' },
  { name: 'rear_wing_v',  geo: [0.05, 0.6, 0.2],pos: [0, 0.5, -1.8],   color: '#222' },
  { name: 'sidepod_l',    geo: [0.5, 0.3, 1.0], pos: [-0.9, 0.18, 0],  color: '#1a1a2e' },
  { name: 'sidepod_r',    geo: [0.5, 0.3, 1.0], pos: [0.9, 0.18, 0],   color: '#1a1a2e' },
  { name: 'engine_cover', geo: [0.6, 0.35, 1.4],pos: [0, 0.45, -0.4],  color: '#E8002D' },
  { name: 'halo',         geo: [0.06, 0.06, 1.2],pos:[0, 0.7, 0.2],    color: '#888' },
  { name: 'aero_detail',  geo: [1.8, 0.03, 0.1],pos: [0, 0.25, 0.5],   color: '#FFD700' },
]

const WHEELS = [
  [-1.1, -0.05, 1.2],
  [1.1, -0.05, 1.2],
  [-1.1, -0.05, -1.2],
  [1.1, -0.05, -1.2],
]

function Part({ index, geo, pos, color }) {
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    const p = useExperienceStore.getState().scrollProgress
    const threshold = (index / PARTS.length) * 0.2
    const t = Math.min(1, Math.max(0, (p - threshold) / 0.03))
    ref.current.scale.setScalar(t)
    ref.current.material.opacity = t
  })

  return (
    <mesh ref={ref} position={pos} scale={0}>
      <boxGeometry args={geo} />
      <meshStandardMaterial color={color} transparent opacity={0} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function Wheel({ pos, index }) {
  const ref = useRef()

  useFrame(() => {
    if (!ref.current) return
    const p = useExperienceStore.getState().scrollProgress
    const threshold = ((6 + index) / PARTS.length) * 0.2
    const t = Math.min(1, Math.max(0, (p - threshold) / 0.03))
    ref.current.scale.setScalar(t)
    ref.current.material.opacity = t
  })

  return (
    <mesh ref={ref} position={pos} rotation={[0, 0, Math.PI / 2]} scale={0}>
      <torusGeometry args={[0.35, 0.18, 16, 32]} />
      <meshStandardMaterial color="#111" transparent opacity={0} metalness={0.3} roughness={0.8} />
    </mesh>
  )
}

export default function AssemblyScene() {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    const p = useExperienceStore.getState().scrollProgress
    groupRef.current.visible = p < 0.38
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#E8002D" />
      {PARTS.map((part, i) => (
        <Part key={part.name} index={i} geo={part.geo} pos={part.pos} color={part.color} />
      ))}
      {WHEELS.map((wpos, i) => (
        <Wheel key={i} pos={wpos} index={i} />
      ))}
    </group>
  )
}
