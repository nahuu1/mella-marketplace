
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, LogOut, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ProfileSidebar = () => {
  const { currentUser, profile, logout, uploadAvatar, updateGeoLocation } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate is handled by the parent component
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      await uploadAvatar(file);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUpdateLocation = async () => {
    try {
      await updateGeoLocation();
      toast.success("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    }
  };
  
  return (
    <Card className="w-full md:w-80 flex-shrink-0">
      <CardHeader className="flex flex-col items-center pb-0 pt-6">
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback>{profile?.full_name?.substring(0, 2).toUpperCase() || currentUser?.email?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
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
        
        <h2 className="text-xl font-bold mb-1">{profile?.full_name || currentUser?.email?.split('@')[0] || "User"}</h2>
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
          onClick={handleUpdateLocation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Update Location
        </Button>
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
  );
};
