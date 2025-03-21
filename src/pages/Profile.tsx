
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { ListingsTab } from "@/components/profile/ListingsTab";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, profile, isLoading, authInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  
  useEffect(() => {
    // Only redirect if authentication is initialized and user is not logged in
    if (authInitialized && !isLoading && !currentUser) {
      console.log("User not logged in, redirecting to auth page");
      toast.error("Please sign in to view your profile");
      navigate("/auth");
    }
  }, [currentUser, isLoading, navigate, authInitialized]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <LoadingProfileSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render anything during redirection
  if (!currentUser) {
    return null;
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

// Loading skeleton component for better UX during loading
const LoadingProfileSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="w-full md:w-1/3 bg-card rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-center">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      <div className="flex-1 w-full md:w-2/3">
        <Skeleton className="h-10 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Profile;
