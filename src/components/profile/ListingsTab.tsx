
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { MapPin, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ListingForm } from "./ListingForm";

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
  const [fetchingListings, setFetchingListings] = useState(false);
  
  // Fetch user's listings
  const fetchListings = async () => {
    if (!currentUser) return;
    
    setFetchingListings(true);
    try {
      console.log("Fetching listings for user:", currentUser.id);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser.id);
      
      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }
      
      console.log("Listings fetched:", data);
      setMyListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load your listings");
    } finally {
      setFetchingListings(false);
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      fetchListings();
      
      // Set up realtime subscription for listings
      const channel = supabase
        .channel('listings-changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'listings',
            filter: `user_id=eq.${currentUser.id}`,
          }, 
          (payload) => {
            console.log("Real-time update received:", payload);
            fetchListings();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
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
      setMyListings(myListings.filter(listing => listing.id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Listings</h2>
          <ListingForm onSuccess={fetchListings} />
        </div>
        
        {fetchingListings ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
            <p>Loading your listings...</p>
          </div>
        ) : myListings.length > 0 ? (
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
      </CardContent>
    </Card>
  );
};
