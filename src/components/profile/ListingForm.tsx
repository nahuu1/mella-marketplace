
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ListingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ListingForm = ({ onSuccess, onCancel, isOpen, setIsOpen }: ListingFormProps) => {
  const { currentUser, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new listing
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    category: "house",
    subcategory: "",
    price: 0,
    price_period: "month",
    location: "",
    images: [] as string[],
  });
  
  const [listingImages, setListingImages] = useState<File[]>([]);
  
  // Get user's location from profile when component mounts
  useEffect(() => {
    if (profile) {
      if (profile.location) {
        setNewListing(prev => ({
          ...prev,
          location: profile.location || ""
        }));
      }
    }
  }, [profile]);
  
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
    if (!currentUser) {
      toast.error("You must be logged in to create a listing");
      return;
    }
    
    if (!newListing.title) {
      toast.error("Please enter a title for your listing");
      return;
    }
    
    if (!newListing.category) {
      toast.error("Please select a category for your listing");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images first
      const imageUrls = await uploadListingImages();
      
      // Get current geo-location if available
      let geoLocation = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            });
          });
          
          geoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (error) {
          console.log("Could not get geo location:", error);
        }
      }
      
      // Create listing
      const { error } = await supabase
        .from('listings')
        .insert({
          user_id: currentUser.id,
          title: newListing.title,
          description: newListing.description || "",
          category: newListing.category || "house",
          subcategory: newListing.subcategory || "",
          price: newListing.price || 0,
          price_period: newListing.price_period || "month",
          location: newListing.location || profile?.location || "",
          images: imageUrls,
        });
      
      if (error) throw error;
      
      toast.success("Listing created successfully!");
      setIsOpen(false);
      
      // Reset form
      setNewListing({
        title: "",
        description: "",
        category: "house",
        subcategory: "",
        price: 0,
        price_period: "month",
        location: profile?.location || "",
        images: [],
      });
      setListingImages([]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    if (onCancel) onCancel();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
          <DialogDescription>
            Create a listing that will be visible to users in your area
          </DialogDescription>
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
                <SelectItem value="car">Car</SelectItem>
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
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleCreateListing} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Creating...
              </>
            ) : (
              "Create Listing"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
