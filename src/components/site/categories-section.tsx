
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Home, Car, Briefcase, ShoppingBag, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "houses",
    title: "Houses",
    description: "Find apartments, villas, and houses for rent or sale",
    icon: Home,
    color: "bg-blue-50 text-blue-600",
    borderColor: "border-blue-100",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  },
  {
    id: "cars",
    title: "Cars",
    description: "Rent or buy cars, SUVs, and other vehicles",
    icon: Car,
    color: "bg-green-50 text-green-600",
    borderColor: "border-green-100",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
  },
  {
    id: "services",
    title: "Services",
    description: "Book professionals for various services",
    icon: Briefcase,
    color: "bg-amber-50 text-amber-600",
    borderColor: "border-amber-100",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
  },
  {
    id: "products",
    title: "Products",
    description: "Shop for local and imported products",
    icon: ShoppingBag,
    color: "bg-purple-50 text-purple-600",
    borderColor: "border-purple-100",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
  }
];

export function CategoriesSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore our diverse categories of listings, from housing and transportation to services and products available in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-lg border",
                category.borderColor
              )}
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold">{category.title}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    category.color
                  )}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                  
                  <a 
                    href={`/${category.id.toLowerCase()}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Explore {category.title}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
