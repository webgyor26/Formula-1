import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DustParticles() {
  const ref = useRef()
  const COUNT = 900

  const [posArr, phases] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const ph = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22
      pos[i * 3 + 1] = Math.random() * 9 - 1.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22
      ph[i] = Math.random() * Math.PI * 2
    }
    return [pos, ph]
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    return g
  }, [posArr])

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: '#606060',
    size: 0.014,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      posArr[ix]     += Math.cos(t * 0.28 + phases[i]) * 0.0018
      posArr[ix + 1] += Math.sin(t * 0.42 + phases[i]) * 0.0012
    }
    geo.attributes.position.needsUpdate = true
  })

  return <points ref={ref} geometry={geo} material={mat} />
}
