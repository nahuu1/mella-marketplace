
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Camera, LogOut, Plus, Pencil, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, profile, logout, updateProfile, uploadAvatar, isLoading } = useAuth();
  
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddListingDialog, setShowAddListingDialog] = useState(false);
  const [fetchingListings, setFetchingListings] = useState(false);
  
  // Form state for profile
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    email: "",
  });

  // Form state for new listing
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    title: "",
    description: "",
    category: "house",
    subcategory: "",
    price: 0,
    price_period: "month",
    location: "",
    images: [],
  });
  
  const [listingImages, setListingImages] = useState<File[]>([]);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/auth");
    }
  }, [currentUser, isLoading, navigate]);
  
  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        email: profile.email || "",
      });
    }
  }, [profile]);
  
  // Fetch user's listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser) return;
      
      setFetchingListings(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        setMyListings(data || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to load your listings");
      } finally {
        setFetchingListings(false);
      }
    };
    
    fetchListings();
    
    // Set up realtime subscription for listings
    const channel = supabase
      .channel('public:listings')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'listings',
          filter: `user_id=eq.${currentUser?.id}`,
        }, 
        () => {
          fetchListings();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        location: formData.location,
        email: formData.email,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      
      if (avatarUrl) {
        await updateProfile({ avatar_url: avatarUrl });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleListingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    setListingImages(prev => [...prev, ...newFiles]);
  };
  
  const uploadListingImages = async (): Promise<string[]> => {
    if (!currentUser || listingImages.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const file of listingImages) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${currentUser.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      try {
        const { error } = await supabase.storage
          .from('listing_images')
          .upload(filePath, file);
        
        if (error) throw error;
        
        const { data } = supabase.storage
          .from('listing_images')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(data.publicUrl);
      } catch (error) {
        console.error("Error uploading listing image:", error);
      }
    }
    
    return uploadedUrls;
  };
  
  const handleCreateListing = async () => {
    if (!currentUser) return;
    
    try {
      // Upload images first
      const imageUrls = await uploadListingImages();
      
      // Create listing
      const { error } = await supabase
        .from('listings')
        .insert({
          user_id: currentUser.id,
          title: newListing.title || "",
          description: newListing.description || "",
          category: newListing.category || "house",
          subcategory: newListing.subcategory || "",
          price: newListing.price || 0,
          price_period: newListing.price_period || "month",
          location: newListing.location || "",
          images: imageUrls,
        });
      
      if (error) throw error;
      
      toast.success("Listing created successfully!");
      setShowAddListingDialog(false);
      setNewListing({
        title: "",
        description: "",
        category: "house",
        subcategory: "",
        price: 0,
        price_period: "month",
        location: "",
        images: [],
      });
      setListingImages([]);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    }
  };
  
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Card */}
            <Card className="w-full md:w-80 flex-shrink-0">
              <CardHeader className="flex flex-col items-center pb-0 pt-6">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>{profile?.full_name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <div className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center">
                      {isUploading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                  </label>
                </div>
                
                <h2 className="text-xl font-bold mb-1">{profile?.full_name || "User"}</h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{profile?.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                  <Phone className="h-3 w-3" />
                  <span>{profile?.phone || "Phone not set"}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Mail className="h-3 w-3" />
                  <span>{profile?.email || currentUser?.email || "Email not set"}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mb-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
            
            {/* Tabs Section */}
            <div className="flex-1">
              <Tabs defaultValue="listings" className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="listings">
                  <Card>
                    <CardContent className="p-6">
                      {fetchingListings ? (
                        <div className="text-center py-12">
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
                          <div className="flex flex-wrap gap-3 justify-center">
                            <Dialog open={showAddListingDialog} onOpenChange={setShowAddListingDialog}>
                              <DialogTrigger asChild>
                                <Button>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Listing
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>Create New Listing</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                      value={newListing.category}
                                      onValueChange={(value) => setNewListing({ ...newListing, category: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="house">House</SelectItem>
                                        <SelectItem value="product">Product</SelectItem>
                                        <SelectItem value="service">Service</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                      id="title"
                                      value={newListing.title}
                                      onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                                      placeholder="Enter listing title"
                                    />
                                  </div>
                                  
                                  <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                      id="description"
                                      value={newListing.description || ""}
                                      onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                      placeholder="Describe your listing"
                                      rows={3}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="price">Price</Label>
                                      <Input
                                        id="price"
                                        type="number"
                                        value={newListing.price || ""}
                                        onChange={(e) => setNewListing({ 
                                          ...newListing, 
                                          price: e.target.value ? parseFloat(e.target.value) : 0 
                                        })}
                                        placeholder="0.00"
                                      />
                                    </div>
                                    
                                    <div className="grid gap-2">
                                      <Label htmlFor="price_period">Period</Label>
                                      <Select
                                        value={newListing.price_period || "month"}
                                        onValueChange={(value) => setNewListing({ ...newListing, price_period: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="month">Monthly</SelectItem>
                                          <SelectItem value="day">Daily</SelectItem>
                                          <SelectItem value="hour">Hourly</SelectItem>
                                          <SelectItem value="one-time">One-time</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  
                                  <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                      id="location"
                                      value={newListing.location || ""}
                                      onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                                      placeholder="Enter location"
                                    />
                                  </div>
                                  
                                  <div className="grid gap-2">
                                    <Label htmlFor="images">Images</Label>
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor="images"
                                        className="cursor-pointer flex h-10 w-full items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {listingImages.length === 0 ? "Add Images" : `${listingImages.length} image(s) selected`}
                                      </Label>
                                      <Input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleListingImageUpload}
                                      />
                                    </div>
                                    {listingImages.length > 0 && (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {listingImages.map((file, index) => (
                                          <div 
                                            key={index}
                                            className="relative h-16 w-16 rounded-md overflow-hidden bg-muted"
                                          >
                                            <img
                                              src={URL.createObjectURL(file)}
                                              alt={`Preview ${index}`}
                                              className="h-full w-full object-cover"
                                            />
                                            <button
                                              type="button"
                                              className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 rounded-bl-md"
                                              onClick={() => setListingImages(prev => prev.filter((_, i) => i !== index))}
                                            >
                                              <Trash className="h-3 w-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setShowAddListingDialog(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleCreateListing}>Create Listing</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardContent className="p-6">
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input 
                            id="name" 
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email
                          </Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={formData.email || currentUser?.email || ""}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                          </Label>
                          <Input 
                            id="phone" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-sm font-medium">
                            Location
                          </Label>
                          <Input 
                            id="location" 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                          />
                        </div>
                        
                        <Button type="submit" className="mt-2">
                          Save Changes
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
