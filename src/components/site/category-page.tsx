
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  location: string | null;
  category: string;
  subcategory: string | null;
  price: number | null;
  price_period: string | null;
  images: string[] | null;
  user_id: string;
  created_at: string;
}

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
}: CategoryPageProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch listings for the current category
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select('*')
          .eq('category', title.toLowerCase());
          
        if (searchTerm) {
          query = query.ilike('title', `%${searchTerm}%`);
        }
        
        if (locationTerm) {
          query = query.ilike('location', `%${locationTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }
        
        setListings(data || []);
      } catch (error) {
        console.error('Error in fetchListings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [title, searchTerm, locationTerm]);

  const handleSearch = () => {
    // The search effect will run automatically when searchTerm or locationTerm changes
    console.log("Searching for:", searchTerm, "in", locationTerm);
  };

  const handleCreateListing = () => {
    if (!currentUser) {
      navigate('/auth');
    } else {
      navigate('/profile');
    }
  };

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border-l w-full md:w-auto">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                  />
                </div>
                <Button size="sm" className="w-full md:w-auto" onClick={handleSearch}>
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
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16">
                <div className={cn("w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6", color)}>
                  {icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2">No listings found</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  There are no {title.toLowerCase()} listings in your area at the moment. Check back later or adjust your search.
                </p>
                <Button onClick={handleCreateListing}>
                  Create a listing
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <Card 
                      key={listing.id} 
                      className="overflow-hidden transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="relative h-64 w-full overflow-hidden">
                        <Badge 
                          className="absolute top-4 left-4 z-10 bg-white/80 text-foreground backdrop-blur-sm"
                        >
                          {listing.subcategory || listing.category}
                        </Badge>
                        
                        <img
                          src={listing.images && listing.images.length > 0 
                            ? listing.images[0] 
                            : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"}
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
                              <span className="text-sm">{listing.location || 'No location specified'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center bg-secondary px-2 py-1 rounded-full">
                            <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
                            <span className="text-sm font-medium">New</span>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between mt-6">
                          <div>
                            <p className="text-lg font-semibold">
                              {listing.price ? `${listing.price} Birr` : 'Contact for price'}
                              {listing.price_period && (
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                  /{listing.price_period}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(listing.created_at).toLocaleDateString()}
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
                
                {listings.length > 0 && (
                  <div className="flex justify-center mt-10">
                    <Button className="rounded-full" onClick={handleCreateListing}>
                      Create a listing
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
