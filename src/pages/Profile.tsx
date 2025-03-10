
import { useState } from "react";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Camera, LogOut, Plus } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  
  // Mock user data - will be replaced with Firebase data
  const [user, setUser] = useState({
    name: "Abebe Kebede",
    email: "abebe@example.com",
    phone: "+251 91 234 5678",
    location: "Addis Ababa, Ethiopia",
    avatarUrl: "",
  });

  // Mock listings data - will be replaced with Firebase data
  const [myListings, setMyListings] = useState<any[]>([]);
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleLogout = () => {
    // Firebase logout will be implemented here
    console.log("Logging out");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Firebase storage upload will be implemented here
    console.log("Uploading file:", file.name);
    
    // Temporary mock for UI testing
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUser(prev => ({
          ...prev,
          avatarUrl: event.target.result as string
        }));
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully."
        });
      }
    };
    reader.readAsDataURL(file);
  };

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
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <div className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center">
                      <Camera className="h-4 w-4" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </label>
                </div>
                
                <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                  <Phone className="h-3 w-3" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
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
                      {myListings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Listings will be displayed here */}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                          <p className="text-muted-foreground mb-6">
                            You haven't posted any listings yet. Create your first listing now!
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Add House
                            </Button>
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Service
                            </Button>
                            <Button variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Product
                            </Button>
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
                          <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </label>
                          <Input 
                            id="name" 
                            value={user.name}
                            onChange={(e) => setUser({...user, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input 
                            id="email" 
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                          </label>
                          <Input 
                            id="phone" 
                            value={user.phone}
                            onChange={(e) => setUser({...user, phone: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="location" className="text-sm font-medium">
                            Location
                          </label>
                          <Input 
                            id="location" 
                            value={user.location}
                            onChange={(e) => setUser({...user, location: e.target.value})}
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
