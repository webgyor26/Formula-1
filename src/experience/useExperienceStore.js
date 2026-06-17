import { create } from 'zustand'

const useExperienceStore = create((set) => ({
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: Math.max(0, Math.min(1, v)) }),
}))

export default useExperienceStore
