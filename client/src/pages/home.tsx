import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import TrustSecurity from "@/components/trust-security";
import Footer from "@/components/footer";
import ServicesSection from "@/components/services-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Dynamic Services Section */}
      <ServicesSection />

      <TrustSecurity />
      <Footer />
    </div>
  );
}
