
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data - in a real app this would come from an API
const listings = [
  {
    id: 1,
    title: "Luxury Villa with Garden",
    location: "Bole, Addis Ababa",
    category: "House",
    subcategory: "Villa",
    price: "35,000 Birr",
    period: "month",
    rating: 4.9,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    featured: true,
  },
  {
    id: 2,
    title: "Toyota Land Cruiser 2020",
    location: "Kirkos, Addis Ababa",
    category: "Car",
    subcategory: "SUV",
    price: "4,500 Birr",
    period: "day",
    rating: 4.7,
    reviews: 14,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
    featured: true,
  },
  {
    id: 3,
    title: "Professional Photography Service",
    location: "Kazanchis, Addis Ababa",
    category: "Service",
    subcategory: "Photography",
    price: "5,000 Birr",
    period: "session",
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    featured: true,
  },
  {
    id: 4,
    title: "Traditional Coffee Set",
    location: "Piassa, Addis Ababa",
    category: "Product",
    subcategory: "Home Goods",
    price: "2,500 Birr",
    period: "one-time",
    rating: 4.9,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
    featured: true,
  },
  {
    id: 5,
    title: "Modern Apartment Near Stadium",
    location: "Lideta, Addis Ababa",
    category: "House",
    subcategory: "Apartment",
    price: "18,000 Birr",
    period: "month",
    rating: 4.6,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    featured: true,
  },
  {
    id: 6,
    title: "Hyundai Tucson 2019",
    location: "Arada, Addis Ababa",
    category: "Car",
    subcategory: "SUV",
    price: "3,800 Birr",
    period: "day",
    rating: 4.5,
    reviews: 11,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d",
    featured: true,
  },
];

export function FeaturedListings() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", "House", "Car", "Service", "Product"];
  
  const filteredListings = activeCategory === "All" 
    ? listings 
    : listings.filter(listing => listing.category === activeCategory);

  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Listings</h2>
            <p className="text-muted-foreground mt-2">Discover our top-rated listings in Ethiopia</p>
          </div>
          
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap", 
                  activeCategory === category 
                    ? "" 
                    : "text-foreground/60 hover:text-foreground"
                )}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card 
              key={listing.id} 
              className="overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Badge 
                  className="absolute top-4 left-4 z-10 bg-white/80 text-foreground backdrop-blur-sm"
                >
                  {listing.category}
                </Badge>
                
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span className="text-sm">{listing.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-secondary px-2 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
                    <span className="text-sm font-medium">{listing.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-end justify-between mt-6">
                  <div>
                    <p className="text-lg font-semibold">
                      {listing.price}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        /{listing.period}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {listing.subcategory} • {listing.reviews} reviews
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button className="rounded-full">
            View All Listings
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
