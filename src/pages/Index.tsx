
import { SiteHeader } from "@/components/site/header";
import { EmergencyServices } from "@/components/site/emergency-services";
import { FeaturedListings } from "@/components/site/featured-listings";
import { CategoriesSection } from "@/components/site/categories-section";
import { FeaturesSection } from "@/components/site/features-section";
import { CTASection } from "@/components/site/cta-section";
import { Footer } from "@/components/site/footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <EmergencyServices />
        <FeaturedListings />
        <CategoriesSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
