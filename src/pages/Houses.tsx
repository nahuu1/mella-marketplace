
import { CategoryPage } from "@/components/site/category-page";
import { Home } from "lucide-react";

const Houses = () => {
  return (
    <CategoryPage
      title="Houses"
      description="Find apartments, villas, and houses for rent or sale near your location in Ethiopia"
      color="bg-blue-50 text-blue-600"
      borderColor="border-blue-100"
      bgColor="bg-blue-50/50"
      icon={<Home className="h-8 w-8" />}
    />
  );
};

export default Houses;
