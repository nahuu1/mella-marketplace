
import { CategoryPage } from "@/components/site/category-page";
import { ShoppingBag } from "lucide-react";

const Products = () => {
  return (
    <CategoryPage
      title="Products"
      description="Shop for local and imported products from sellers in your area"
      color="bg-purple-50 text-purple-600"
      borderColor="border-purple-100"
      bgColor="bg-purple-50/50"
      icon={<ShoppingBag className="h-8 w-8" />}
    />
  );
};

export default Products;
