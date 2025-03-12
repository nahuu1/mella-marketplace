
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ListingsTab } from "@/components/profile/ListingsTab";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  
  // Redirect if not logged in after loading completes
  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error("Please sign in to view your profile");
      navigate("/auth");
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 py-24">
          <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
            <p>Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect, no need to render anything
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Card */}
            <ProfileSidebar />
            
            {/* Tabs Section */}
            <div className="flex-1">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="listings">My Listings</TabsTrigger>
                  <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="listings">
                  <ListingsTab />
                </TabsContent>
                
                <TabsContent value="settings">
                  <ProfileSettings />
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
