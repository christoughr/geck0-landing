import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import ProductMockup from "@/components/ProductMockup";
import DemoCtaBanner from "@/components/DemoCtaBanner";
import HowItWorks from "@/components/HowItWorks";
import AccuracySection from "@/components/AccuracySection";
import SocialProof from "@/components/SocialProof";
import Security from "@/components/Security";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import FaqSchemaServer from "@/components/FaqSchemaServer";
import { CtaSection, Footer } from "@/components/CtaFooter";

export default function Home() {
  return (
    <>
      <FaqSchemaServer />
      <Navbar />
      <main id="main-content" className="overflow-x-clip max-w-full">
        <Hero />
        <LogoBar />
        <Problem />
        <Features />
        <ProductMockup />
        <DemoCtaBanner />
        <HowItWorks />
        <AccuracySection />
        <SocialProof />
        <Security />
        <Pricing showViewAll homeTeaser />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
