import { create } from 'zustand'

const useSceneStore = create((set) => ({
  scrollProgress: 0,
  activeSection: 0,
  isLoaded: false,

  // Derived telemetry
  rpm: 0,
  speed: 0,
  gear: 1,
  gForce: 0,

  setScrollProgress: (v) => {
    const s = Math.max(0, Math.min(1, v))

    let section = 0
    if (s > 0.12) section = 1
    if (s > 0.28) section = 2
    if (s > 0.42) section = 3
    if (s > 0.55) section = 4
    if (s > 0.65) section = 5
    if (s > 0.75) section = 6
    if (s > 0.87) section = 7
    if (s > 0.93) section = 8

    // RPM climbs through sections 1-3
    let rpm = 0
    if (s > 0.12 && s <= 0.28) rpm = ((s - 0.12) / 0.16) * 8000
    else if (s > 0.28 && s <= 0.42) rpm = 8000 + ((s - 0.28) / 0.14) * 7000
    else if (s > 0.42 && s <= 0.65) rpm = 15000
    else if (s > 0.65 && s <= 0.75) rpm = 15000 * (1 - (s - 0.65) / 0.10)
    rpm = Math.max(0, Math.min(15000, rpm))

    // Speed
    let speed = 0
    if (s > 0.55 && s <= 0.65) speed = ((s - 0.55) / 0.10) * 350
    else if (s > 0.65 && s <= 0.75) speed = 350 - ((s - 0.65) / 0.10) * 200
    else if (s > 0.12) speed = (rpm / 15000) * 280
    speed = Math.max(0, Math.min(350, speed))

    // Gear
    let gear = 1
    if (speed > 60) gear = 2
    if (speed > 110) gear = 3
    if (speed > 160) gear = 4
    if (speed > 210) gear = 5
    if (speed > 255) gear = 6
    if (speed > 295) gear = 7
    if (speed > 330) gear = 8

    // G-force peaks in tunnel
    const gForce = (s > 0.42 && s < 0.55)
      ? Math.sin(((s - 0.42) / 0.13) * Math.PI) * 4.8
      : 0

    set({ scrollProgress: s, activeSection: section, rpm, speed, gear, gForce })
  },

  setIsLoaded: (v) => set({ isLoaded: v }),
}))

export default useSceneStore
