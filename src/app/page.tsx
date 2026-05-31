import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import ProductMockup from "@/components/ProductMockup";
import HowItWorks from "@/components/HowItWorks";
import SocialProof from "@/components/SocialProof";
import Security from "@/components/Security";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import { CtaSection, Footer } from "@/components/CtaFooter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoBar />
        <Problem />
        <Features />
        <ProductMockup />
        <HowItWorks />
        <SocialProof />
        <Security />
        <Pricing />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
