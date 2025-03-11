
import { SiteHeader } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { EmergencyServices } from "@/components/site/emergency-services";

const Explore = () => {
  const { currentUser, profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* User welcome section */}
          {currentUser && (
            <section className="mb-12">
              <Card className="border-none shadow-none bg-gradient-to-r from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">
                        Welcome back, {profile?.full_name || currentUser.email.split('@')[0]}!
                      </h1>
                      <p className="text-muted-foreground">
                        Explore listings near you or create a new listing today.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild>
                        <Link to="/profile">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create Listing
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Emergency services section - only shows when user is logged in */}
          {currentUser && (
            <section className="mb-12">
              <EmergencyServices />
            </section>
          )}

          {/* Main explore section */}
          <section>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Explore Mella</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find houses, cars, services, and products near you in Ethiopia
              </p>

              {/* Search bar */}
              <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col md:flex-row gap-4 items-center bg-background rounded-lg p-2 border">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search for anything..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border-l w-full md:w-auto">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                  />
                </div>
                <Button size="sm" className="w-full md:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to="/houses">
                  <div className="bg-blue-50 h-32 flex items-center justify-center">
                    <div className="bg-blue-100 rounded-full p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 h-6 w-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-lg">Houses</h3>
                    <p className="text-sm text-muted-foreground">Find apartments, villas, and houses</p>
                  </CardContent>
                </Link>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to="/cars">
                  <div className="bg-green-50 h-32 flex items-center justify-center">
                    <div className="bg-green-100 rounded-full p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 h-6 w-6"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-lg">Cars</h3>
                    <p className="text-sm text-muted-foreground">Rent or buy cars and other vehicles</p>
                  </CardContent>
                </Link>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to="/services">
                  <div className="bg-amber-50 h-32 flex items-center justify-center">
                    <div className="bg-amber-100 rounded-full p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 h-6 w-6"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-lg">Services</h3>
                    <p className="text-sm text-muted-foreground">Book professionals for various services</p>
                  </CardContent>
                </Link>
              </Card>

              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <Link to="/products">
                  <div className="bg-purple-50 h-32 flex items-center justify-center">
                    <div className="bg-purple-100 rounded-full p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 h-6 w-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-lg">Products</h3>
                    <p className="text-sm text-muted-foreground">Shop for local and imported products</p>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
