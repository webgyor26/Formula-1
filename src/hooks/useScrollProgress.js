import useSceneStore from '../store/useSceneStore'

export function useScrollProgress() {
  return useSceneStore((s) => s.scrollProgress)
}

// Map value from [inStart,inEnd] → [outStart,outEnd], clamped 0-1
export function clamp01(value, start, end) {
  if (end === start) return 0
  return Math.max(0, Math.min(1, (value - start) / (end - start)))
}

export function mapRange(value, inStart, inEnd, outStart, outEnd) {
  const t = clamp01(value, inStart, inEnd)
  return outStart + t * (outEnd - outStart)
}
