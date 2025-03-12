
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

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useAuth();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/auth");
    }
  }, [currentUser, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-24">
        {isLoading ? (
          <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-3"></div>
            <p>Loading profile...</p>
          </div>
        ) : !currentUser ? (
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
            <Card className="w-full p-6">
              <p className="text-center mb-4">You need to be logged in to access your profile</p>
              <div className="flex justify-center">
                <button 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Card */}
              <ProfileSidebar />
              
              {/* Tabs Section */}
              <div className="flex-1">
                <Tabs defaultValue="listings" className="w-full">
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
