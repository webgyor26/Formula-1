import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useSceneStore from '../../store/useSceneStore'
import { clamp01 } from '../../hooks/useScrollProgress'

export default function PostProcessing() {
  const caRef = useRef()

  useFrame(() => {
    const { scrollProgress } = useSceneStore.getState()
    const speedT = clamp01(scrollProgress, 0.42, 0.68)
    if (caRef.current) {
      caRef.current.offset = new THREE.Vector2(speedT * 0.0065, speedT * 0.003)
    }
  })

  return (
    <EffectComposer>
      <Bloom
        intensity={1.8}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.35}
        blendFunction={BlendFunction.ADD}
      />
      <ChromaticAberration
        ref={caRef}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0008, 0.0004)}
      />
      <Vignette
        offset={0.38}
        darkness={0.72}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.ADD}
        opacity={0.035}
      />
    </EffectComposer>
  )
}
