import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import CampusCodePipeline from '../components/landing/pipeline/CampusCodePipeline';
import Features from '../components/landing/Features';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';
import { StaticDotGrid } from '../components/ui/StaticDotGrid';

const Landing = () => {
  return (
    <div className="cc-shell relative isolate flex min-h-screen flex-col">
      <StaticDotGrid />
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <CampusCodePipeline />
        <Features />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
