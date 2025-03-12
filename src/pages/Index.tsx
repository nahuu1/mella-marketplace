
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site/header";
import { EmergencyServices } from "@/components/site/emergency-services";
import { FeaturedListings } from "@/components/site/featured-listings";
import { CategoriesSection } from "@/components/site/categories-section";
import { FeaturesSection } from "@/components/site/features-section";
import { CTASection } from "@/components/site/cta-section";
import { Footer } from "@/components/site/footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/auth");
    }
  }, [currentUser, isLoading, navigate]);

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
