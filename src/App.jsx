import { useLenis } from './hooks/useLenis'
import useSceneStore from './store/useSceneStore'
import Loader from './components/Loader'
import Navigation from './components/Navigation'
import SceneCanvas from './components/Canvas/SceneCanvas'
import SpeedLines from './components/Effects/SpeedLines'
import TelemetryHUD from './components/HUD/TelemetryHUD'
import Speedometer from './components/HUD/Speedometer'
import IntroSection from './sections/IntroSection'
import EmergenceSection from './sections/EmergenceSection'
import SpeedSection from './sections/SpeedSection'
import TunnelSection from './sections/TunnelSection'
import VelocitySection from './sections/VelocitySection'
import RaceSection from './sections/RaceSection'
import AnatomySection from './sections/AnatomySection'
import AssemblySection from './sections/AssemblySection'
import HeroSection from './sections/HeroSection'

export default function App() {
  useLenis()
  const scrollProgress = useSceneStore((s) => s.scrollProgress)

  return (
    <>
      {/* Loading screen */}
      <Loader />

      {/* 3D canvas — fixed, full viewport */}
      <SceneCanvas scrollProgress={scrollProgress} />

      {/* Speed-line canvas overlay */}
      <SpeedLines />

      {/* UI layer — all 2D overlays */}
      <div className="ui-layer">
        <Navigation />

        {/* Corner frame accents */}
        <div className="corner-accent corner-accent-tl" />
        <div className="corner-accent corner-accent-tr" />
        <div className="corner-accent corner-accent-bl" />
        <div className="corner-accent corner-accent-br" />

        {/* Section text reveals */}
        <IntroSection />
        <EmergenceSection />
        <SpeedSection />
        <TunnelSection />
        <VelocitySection />
        <RaceSection />
        <AnatomySection />
        <AssemblySection />
        <HeroSection />

        {/* Telemetry HUD */}
        <TelemetryHUD />

        {/* Full-screen speedometer */}
        <Speedometer />

        {/* Top scroll progress bar */}
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {/* Scanlines */}
        <div className="scanlines" />
      </div>

      {/* Invisible scroll height — 900vh */}
      <div style={{ height: '900vh' }} aria-hidden="true" />
    </>
  )
}
