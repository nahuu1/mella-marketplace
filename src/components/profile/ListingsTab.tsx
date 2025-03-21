
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { MapPin, Trash, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListingForm } from "./ListingForm";
import { Skeleton } from "@/components/ui/skeleton";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: number | null;
  price_period: string | null;
  location: string | null;
  images: string[] | null;
}

export const ListingsTab = () => {
  const { currentUser } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [fetchingListings, setFetchingListings] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showListingForm, setShowListingForm] = useState(false);
  
  // Fetch user's listings
  const fetchListings = async () => {
    if (!currentUser) {
      setFetchingListings(false);
      return;
    }
    
    setFetchingListings(true);
    setError(null);
    
    try {
      console.log("Fetching listings for user:", currentUser.id);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error("Error fetching listings:", error);
        setError(error);
        throw error;
      }
      
      console.log("Listings fetched:", data);
      setMyListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setFetchingListings(false);
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      fetchListings();
    }
  }, [currentUser]);
  
  const handleDeleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Listing deleted successfully!");
      setMyListings(prev => prev.filter(listing => listing.id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };
  
  const handleListingSuccess = () => {
    fetchListings();
    setShowListingForm(false);
  };
  
  // Show loading state when fetching listings
  if (fetchingListings) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Listings</h2>
            <Button onClick={() => setShowListingForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show error if there's a problem fetching listings
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Listings</h2>
            <Button onClick={() => setShowListingForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Button>
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-destructive mb-2">Error loading listings</h3>
            <p className="text-muted-foreground mb-6">
              {error.message || "Something went wrong when loading your listings."}
            </p>
            <Button onClick={fetchListings}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Listings</h2>
          <Button onClick={() => setShowListingForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </div>
        
        {myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="aspect-video relative bg-muted">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="icon" variant="destructive" onClick={() => handleDeleteListing(listing.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-muted-foreground capitalize">{listing.category}</div>
                    {listing.price ? (
                      <div className="font-medium">
                        ${listing.price}
                        {listing.price_period && <span className="text-sm text-muted-foreground">/{listing.price_period}</span>}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Price not set</div>
                    )}
                  </div>
                  {listing.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      <span>{listing.location}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't posted any listings yet. Create your first listing now!
            </p>
          </div>
        )}
        
        {showListingForm && (
          <ListingForm 
            onSuccess={handleListingSuccess} 
            onCancel={() => setShowListingForm(false)}
            isOpen={showListingForm}
            setIsOpen={setShowListingForm}
          />
        )}
      </CardContent>
    </Card>
  );
};
