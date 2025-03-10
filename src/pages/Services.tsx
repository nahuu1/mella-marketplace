
import { CategoryPage } from "@/components/site/category-page";
import { Briefcase } from "lucide-react";

const Services = () => {
  return (
    <CategoryPage
      title="Services"
      description="Book professionals for various services including plumbing, electrical work, cleaning, and more"
      color="bg-amber-50 text-amber-600"
      borderColor="border-amber-100"
      bgColor="bg-amber-50/50"
      icon={<Briefcase className="h-8 w-8" />}
    />
  );
};

export default Services;
