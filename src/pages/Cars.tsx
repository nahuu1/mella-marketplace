
import { CategoryPage } from "@/components/site/category-page";
import { Car } from "lucide-react";

const Cars = () => {
  return (
    <CategoryPage
      title="Cars"
      description="Rent or buy cars, SUVs, and other vehicles available in your area"
      color="bg-green-50 text-green-600"
      borderColor="border-green-100"
      bgColor="bg-green-50/50"
      icon={<Car className="h-8 w-8" />}
    />
  );
};

export default Cars;
