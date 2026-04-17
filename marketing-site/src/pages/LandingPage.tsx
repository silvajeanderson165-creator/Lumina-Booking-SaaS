import { ParticleBackground } from '../components/effects/ParticleBackground';
import { GlowOrbs } from '../components/effects/GlowOrbs';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../sections/HeroSection';
import { ProblemSection } from '../sections/ProblemSection';
import { SolutionSection } from '../sections/SolutionSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { DemoSection } from '../sections/DemoSection';
import { CTASection } from '../sections/CTASection';
import { PricingSection } from '../sections/PricingSection';
import { Footer } from '../sections/Footer';
import '../App.css';

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground />
      <GlowOrbs />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <PricingSection />
        <DemoSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
