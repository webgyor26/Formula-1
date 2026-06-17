import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Stars, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import F1Car from '../Car/F1Car'
import DustParticles from '../Environment/DustParticles'
import TunnelGeometry from '../Environment/TunnelGeometry'
import FloorReflection from '../Environment/FloorReflection'
import PostProcessing from '../Effects/PostProcessing'
import useSceneStore from '../../store/useSceneStore'
import { clamp01 } from '../../hooks/useScrollProgress'

const _v3 = new THREE.Vector3()

function CameraRig() {
  useFrame(({ camera }) => {
    const { scrollProgress: s } = useSceneStore.getState()

    let cx = 0, cy = 2.4, cz = 6.5
    let lx = 0, ly = 0.18, lz = 0

    if (s < 0.12) {
      // Intro: slightly elevated, looking down at dark stage
      cx = 0; cy = 2.4; cz = 6.5
    } else if (s < 0.28) {
      // Emergence: slow orbit as car rises
      const t = clamp01(s, 0.12, 0.28)
      cx = Math.sin(t * 1.2) * 2.2
      cy = 2.4 - t * 0.6
      cz = 6.5 - t * 0.6
    } else if (s < 0.42) {
      // Systems alive: tighten in
      const t = clamp01(s, 0.28, 0.42)
      cx = 2.2 * (1 - t)
      cy = 1.8 - t * 0.2
      cz = 5.9 - t * 0.5
      ly = 0.18 + t * 0.1
    } else if (s < 0.55) {
      // Tunnel: camera dives forward, cockpit POV
      const t = clamp01(s, 0.42, 0.55)
      cx = 0
      cy = 1.6 - t * 0.8
      cz = 5.4 - t * 4.5
      lz = -t * 3.5
      ly = 0.28 + t * 0.2
    } else if (s < 0.65) {
      // Speedometer section: very low, front-on
      const t = clamp01(s, 0.55, 0.65)
      cx = t * 0.3
      cy = 0.8 - t * 0.4
      cz = 0.9 - t * 0.3
      ly = 0.48 + t * 0.5
    } else if (s < 0.75) {
      // Race: side-on tracking shot
      const t = clamp01(s, 0.65, 0.75)
      const sideIn = clamp01(s, 0.65, 0.68)
      cx = 5 * sideIn
      cy = 1.4
      cz = 0.5 - t * 0.5
      ly = 0.2
    } else if (s < 0.87) {
      // Anatomy: isometric overview
      const t = clamp01(s, 0.75, 0.87)
      cx = Math.sin(t * Math.PI * 0.6) * 2.5
      cy = 1.8 + t * 2.8
      cz = 5.5 + t * 2
      ly = 0.18 - t * 0.4
    } else {
      // Hero: cinematic pull-back
      const t = clamp01(s, 0.87, 1.0)
      cx = -1.5 * t
      cy = 2.2 + t * 0.8
      cz = 6 + t * 1.5
      ly = 0.2 - t * 0.3
    }

    camera.position.lerp(_v3.set(cx, cy, cz), 0.06)
    camera.lookAt(lx, ly, lz)
  })

  return null
}

function Lights() {
  const engineRef = useRef()

  useFrame(({ clock }) => {
    const { scrollProgress: s } = useSceneStore.getState()
    if (!engineRef.current) return
    const t = clamp01(s, 0.28, 0.45)
    const flicker = Math.sin(clock.getElapsedTime() * 18) * 0.4 + 0.6
    engineRef.current.intensity = t * 9 * flicker
  })

  return (
    <>
      {/* Key — dramatic side/top */}
      <directionalLight position={[4, 6, 3]} intensity={2.8} color="#FFFFFF" castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={0.5} shadow-camera-far={30}
        shadow-camera-left={-6} shadow-camera-right={6}
        shadow-camera-top={6} shadow-camera-bottom={-6}
      />
      {/* Fill — cool blue from left */}
      <directionalLight position={[-5, 3, 2]} intensity={0.9} color="#3355FF" />
      {/* Rim — warm from behind */}
      <directionalLight position={[0, 2.5, -6]} intensity={1.4} color="#FF5533" />
      {/* Under-light — red dramatic floor bounce */}
      <pointLight position={[0, -0.6, 0]} intensity={3.5} color="#E8002D" distance={5} decay={2} />
      {/* Engine glow */}
      <pointLight ref={engineRef} position={[0, 0.25, -0.5]} intensity={0} color="#FF4400" distance={3.5} decay={2} />
      {/* Ambient */}
      <ambientLight intensity={0.12} color="#101828" />
    </>
  )
}

export default function SceneCanvas({ scrollProgress }) {
  return (
    <div className="canvas-layer">
      <Canvas
        camera={{ position: [0, 2.4, 6.5], fov: 44, near: 0.08, far: 120 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        shadows="soft"
      >
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <CameraRig />
          <Lights />

          <F1Car scrollProgress={scrollProgress} />
          <DustParticles />
          <TunnelGeometry />
          <FloorReflection />

          <Stars radius={90} depth={55} count={2200} factor={3} saturation={0} fade speed={0.4} />

          <Environment preset="night" />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  )
}
