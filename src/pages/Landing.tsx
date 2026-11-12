import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import CampusCodePipeline from '../components/landing/pipeline/CampusCodePipeline';
import Features from '../components/landing/Features';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Navbar />

      <main>
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