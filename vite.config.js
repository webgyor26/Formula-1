import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Formula-1/',
  plugins: [react()],
  optimizeDeps: {
    include: ['three', 'gsap']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'vendor': ['react', 'react-dom', 'framer-motion', 'gsap', 'zustand'],
        }
      }
    }
  }
})
