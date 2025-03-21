
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  price: number | null;
  price_period: string | null;
  location: string | null;
  images: string[] | null;
}

export const NearbyListings = () => {
  const { currentUser, profile } = useAuth();
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  
  // Function to parse coordinates from location string
  const parseCoordinates = (locationString: string | null) => {
    if (!locationString) return null;
    
    const coordsMatch = locationString.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (coordsMatch && coordsMatch.length >= 3) {
      return {
        latitude: parseFloat(coordsMatch[1]),
        longitude: parseFloat(coordsMatch[2])
      };
    }
    return null;
  };
  
  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };
  
  // Get user's coordinates
  useEffect(() => {
    const getUserLocation = async () => {
      // First try to get the current precise location
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });
          
          setUserCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          console.log("Got precise location:", position.coords.latitude, position.coords.longitude);
          return;
        } catch (error) {
          console.log("Could not get precise location:", error);
        }
      }
      
      // Fallback to user's profile location if available
      if (profile?.location) {
        const coords = parseCoordinates(profile.location);
        if (coords) {
          setUserCoordinates(coords);
          console.log("Using profile location:", coords);
          return;
        }
      }
      
      // Default to Addis Ababa coordinates if nothing else works
      console.log("Using default location (Addis Ababa)");
      setUserCoordinates({
        latitude: 9.0105,
        longitude: 38.7645
      });
    };
    
    getUserLocation();
  }, [profile]);
  
  // Fetch nearby listings
  useEffect(() => {
    if (!userCoordinates || !currentUser) return;
    
    const fetchNearbyListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all listings not owned by the current user
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .neq('user_id', currentUser.id);
        
        if (error) throw error;
        
        if (data) {
          // Filter and sort listings by distance
          const listingsWithDistance = data
            .map(listing => {
              const listingCoords = parseCoordinates(listing.location);
              if (!listingCoords) return { ...listing, distance: Infinity };
              
              const distance = calculateDistance(
                userCoordinates.latitude,
                userCoordinates.longitude,
                listingCoords.latitude,
                listingCoords.longitude
              );
              
              return { ...listing, distance };
            })
            .filter(listing => listing.distance < 50) // Only listings within 50km
            .sort((a, b) => a.distance - b.distance); // Sort by distance
          
          setNearbyListings(listingsWithDistance);
        }
      } catch (error) {
        console.error("Error fetching nearby listings:", error);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchNearbyListings();
  }, [currentUser, userCoordinates]);
  
  // Set up real-time subscription for new listings
  useEffect(() => {
    if (!currentUser || !userCoordinates) return;
    
    // Create a Supabase channel for real-time updates
    const channel = supabase
      .channel('public:listings:nearby')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'listings',
          filter: `user_id=neq.${currentUser.id}`
        }, 
        (payload) => {
          console.log('New listing added:', payload);
          
          // Process the new listing
          const newListing = payload.new as Listing;
          const listingCoords = parseCoordinates(newListing.location);
          
          if (listingCoords) {
            const distance = calculateDistance(
              userCoordinates.latitude,
              userCoordinates.longitude,
              listingCoords.latitude,
              listingCoords.longitude
            );
            
            // Only add to the list if it's within 50km
            if (distance < 50) {
              setNearbyListings(prev => [...prev, { ...newListing, distance }]
                .sort((a: any, b: any) => a.distance - b.distance));
            }
          }
        }
      )
      .subscribe();
    
    // Clean up the subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, userCoordinates]);
  
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'house': return 'bg-blue-100 text-blue-800';
      case 'car': return 'bg-green-100 text-green-800';
      case 'service': return 'bg-amber-100 text-amber-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Nearby Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-36 w-full" />
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
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Nearby Listings</h2>
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-destructive mb-2">Error loading nearby listings</h3>
            <p className="text-muted-foreground">
              {error.message || "Something went wrong when loading nearby listings."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Nearby Listings</h2>
        
        {nearbyListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyListings.map((listing: any) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryBadgeClass(listing.category)}`}>
                      {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
                  {listing.price ? (
                    <div className="font-medium mt-1">
                      ${listing.price}
                      {listing.price_period && <span className="text-sm text-muted-foreground">/{listing.price_period}</span>}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">Price not set</div>
                  )}
                  {listing.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {listing.distance ? 
                          `${listing.distance.toFixed(1)} km away` : 
                          "Distance unknown"}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No nearby listings found</h3>
            <p className="text-muted-foreground">
              We couldn't find any listings in your area. Check back later!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
