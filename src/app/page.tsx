import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Slider from "@/components/Slider";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Slider />
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
}
