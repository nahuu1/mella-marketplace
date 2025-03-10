
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";

interface CategoryPageProps {
  title: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  icon: React.ReactNode;
  emptyState?: boolean;
}

export function CategoryPage({
  title,
  description,
  color,
  borderColor,
  bgColor,
  icon,
  emptyState = true,
}: CategoryPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-24">
        {/* Hero section */}
        <section className={cn("py-12 px-4", bgColor)}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6", color)}>
                {icon}
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                {description}
              </p>
              <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 items-center bg-background rounded-lg p-2 border">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder={`Search for ${title.toLowerCase()}...`} 
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border-l w-full md:w-auto">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
                </div>
                <Button size="sm" className="w-full md:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="rounded-full">
                  <SlidersHorizontal className="h-3 w-3 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Latest
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Nearby
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Listings section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {emptyState ? (
              <div className="text-center py-16">
                <div className={cn("w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6", color)}>
                  {icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2">No listings found</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  There are no {title.toLowerCase()} listings in your area at the moment. Check back later or adjust your search.
                </p>
                <Button>
                  Create a listing
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Listing cards would go here */}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
