import React from 'react';
import { Navbar } from './components/sections/Navbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { HeroSection } from './components/sections/HeroSection';
import { MarqueeSection } from './components/sections/MarqueeSection';
import { AboutSection } from './components/sections/AboutSection';
import { ServicesSection } from './components/sections/ServicesSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { JourneySection } from './components/sections/JourneySection';
import { ContactSection } from './components/sections/ContactSection';
import { Scene } from './components/Scene';
import { useKageScroll, kageMotion } from './lib/useKageScroll';

export const App: React.FC = () => {
  useKageScroll();
  const bgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Cinematic scroll-driven background transformation
    const unsubscribeBg = kageMotion.subscribe((rig) => {
      if (bgRef.current) {
        if (rig.reducedMotion) {
          bgRef.current.style.transform = '';
          return;
        }
        // Subtle depth scaling and responsive pointer parallax
        const scale = 1 + rig.smoothGlobalProgress * 0.05;
        const driftX = rig.mx * 10;
        const driftMy = rig.my * 8;
        bgRef.current.style.transform = `translate3d(${driftX.toFixed(1)}px, ${driftMy.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
      }
    });

    return () => {
      unsubscribeBg();
    };
  }, []);

  return (
    <div
      style={{ overflowX: 'clip' }}
      className="relative w-full min-h-screen bg-transparent text-[#D7E2EA] font-sans selection:bg-[#B600A8] selection:text-white"
    >
      <div ref={bgRef} className="fixed -inset-8 z-0 overflow-hidden will-change-transform">
        <Scene />
      </div>
      <CustomCursor />
      <Navbar />

      <main className="relative z-10 w-full">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <SkillsSection />
        <JourneySection />
        <ContactSection />
      </main>
    </div>
  );
};

export default App;
