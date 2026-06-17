import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SparkSystem({ intensity = 0 }) {
  const pointsRef = useRef()
  const COUNT = 250

  const posArr = useMemo(() => new Float32Array(COUNT * 3), [])
  const velArr = useMemo(() => new Float32Array(COUNT * 3), [])
  const lifeArr = useMemo(() => {
    const a = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) a[i] = Math.random()
    return a
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    return g
  }, [posArr])

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: new THREE.Color('#FF8800'),
    size: 0.03,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    opacity: 0,
  }), [])

  useFrame((_, dt) => {
    if (!pointsRef.current) return
    const active = intensity > 0.02
    pointsRef.current.visible = active
    if (!active) return

    mat.opacity = intensity * 0.85

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      lifeArr[i] -= dt * 3.5

      if (lifeArr[i] <= 0) {
        // Respawn at diffuser (rear underside)
        posArr[ix]     = (Math.random() - 0.5) * 0.65
        posArr[ix + 1] = -0.12
        posArr[ix + 2] = -1.85 + (Math.random() - 0.5) * 0.35

        velArr[ix]     = (Math.random() - 0.5) * 3 * intensity
        velArr[ix + 1] = (Math.random() * 1.8 + 0.4) * intensity
        velArr[ix + 2] = -(Math.random() * 3 + 1) * intensity

        lifeArr[i] = Math.random() * 0.35 + 0.08
      } else {
        posArr[ix]     += velArr[ix] * dt
        posArr[ix + 1] += velArr[ix + 1] * dt
        posArr[ix + 2] += velArr[ix + 2] * dt
        velArr[ix + 1] -= 6 * dt
      }
    }
    geo.attributes.position.needsUpdate = true
  })

  return <points ref={pointsRef} geometry={geo} material={mat} />
}
