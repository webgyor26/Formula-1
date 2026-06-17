import { create } from 'zustand'

const useExperienceStore = create((set) => ({
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),
}))

export default useExperienceStore
