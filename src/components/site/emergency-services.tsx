
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, AlertCircle, AlertTriangle, Shield, Stethoscope, Building, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Types for emergency services
interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire' | 'clinic' | 'pharmacy';
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  distance?: number; // in kilometers
}

// Updated emergency services with real phone numbers for Ethiopia
const emergencyServices: EmergencyService[] = [
  {
    id: '1',
    name: 'Tikur Anbessa Specialized Hospital',
    type: 'hospital',
    phone: '+251-111-239-752',
    location: { latitude: 9.0105, longitude: 38.7468 },
    address: 'Algeria St, Addis Ababa',
  },
  {
    id: '2',
    name: 'Federal Police Commission',
    type: 'police',
    phone: '991',
    location: { latitude: 9.0252, longitude: 38.7528 },
    address: 'Jomo Kenyatta St, Addis Ababa',
  },
  {
    id: '3',
    name: 'Addis Ababa Fire & Emergency Prevention',
    type: 'fire',
    phone: '939',
    location: { latitude: 9.0302, longitude: 38.7618 },
    address: 'Churchill Avenue, Addis Ababa',
  },
  {
    id: '4',
    name: 'St. Paul\'s Hospital Millennium Medical College',
    type: 'hospital',
    phone: '+251-111-270-208',
    location: { latitude: 9.0312, longitude: 38.7608 },
    address: 'Swinfen Lane, Addis Ababa',
  },
  {
    id: '5',
    name: 'MENILIK II HOSPITAL',
    type: 'hospital',
    phone: '+251-111-124-017',
    location: { latitude: 9.0383, longitude: 38.7623 },
    address: 'Gotera, Addis Ababa',
  },
  {
    id: '6',
    name: 'Yekatit 12 Hospital Medical College',
    type: 'hospital',
    phone: '+251-111-552-470',
    location: { latitude: 9.0232, longitude: 38.7488 },
    address: 'Asmara Road, Addis Ababa',
  },
  {
    id: '7',
    name: 'Gandhi Memorial Hospital',
    type: 'hospital',
    phone: '+251-111-516-688',
    location: { latitude: 9.0213, longitude: 38.7585 },
    address: 'Kirkos, Addis Ababa',
  },
  {
    id: '8',
    name: 'Zewditu Memorial Hospital',
    type: 'hospital',
    phone: '+251-111-516-399',
    location: { latitude: 9.0147, longitude: 38.7512 },
    address: 'Lideta, Addis Ababa',
  },
  {
    id: '9',
    name: 'Bole 17 Police Station',
    type: 'police',
    phone: '991',
    location: { latitude: 8.9879, longitude: 38.7985 },
    address: 'Bole, Addis Ababa',
  },
  {
    id: '10',
    name: 'Amanuel Mental Specialized Hospital',
    type: 'hospital',
    phone: '+251-111-539-539',
    location: { latitude: 9.0288, longitude: 38.7581 },
    address: 'Amanuel Area, Addis Ababa',
  },
  {
    id: '11',
    name: 'Red Cross Ambulance Service',
    type: 'clinic',
    phone: '907',
    location: { latitude: 9.0202, longitude: 38.7468 },
    address: 'Ras Desta Damtew Ave, Addis Ababa',
  },
  {
    id: '12',
    name: 'Kadisco Pharmacy',
    type: 'pharmacy',
    phone: '+251-116-612-054',
    location: { latitude: 9.0282, longitude: 38.7498 },
    address: 'Bole Road, Addis Ababa',
  },
  {
    id: '13',
    name: 'Emergency Coordinating Center',
    type: 'clinic',
    phone: '952',
    location: { latitude: 9.0251, longitude: 38.7573 },
    address: 'Central Addis Ababa',
  },
  {
    id: '14',
    name: 'EPHARM Pharmacy',
    type: 'pharmacy',
    phone: '+251-111-551-313',
    location: { latitude: 9.0137, longitude: 38.7608 },
    address: 'Mexico Square, Addis Ababa',
  },
  {
    id: '15',
    name: 'National Blood Bank Service',
    type: 'clinic',
    phone: '+251-116-634-290',
    location: { latitude: 9.0108, longitude: 38.7514 },
    address: 'Tikur Anbessa Hospital, Addis Ababa',
  },
];

// Distance calculation using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Map emergency service type to icon
const getServiceIcon = (type: string) => {
  switch(type) {
    case 'hospital':
      return <Stethoscope className="h-5 w-5 text-red-500" />;
    case 'police':
      return <Shield className="h-5 w-5 text-blue-500" />;
    case 'fire':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'clinic':
      return <Building className="h-5 w-5 text-emerald-500" />;
    case 'pharmacy':
      return <Pill className="h-5 w-5 text-green-500" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

// Background images for emergency service types
const serviceBackgrounds = {
  'hospital': "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  'police': "https://images.unsplash.com/photo-1542400935-70190c63c242?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  'fire': "https://images.unsplash.com/photo-1560178789-686486fbac85?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  'clinic': "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  'pharmacy': "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
  'default': "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
};

export const EmergencyServices = () => {
  const { profile } = useAuth();
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [nearbyServices, setNearbyServices] = useState<EmergencyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Use browser's Geolocation API to get user's location with high accuracy
    const getUserLocation = () => {
      setIsLoading(true);
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setIsLoading(false);
        return;
      }

      // Check if we already have location in the user profile
      if (profile?.geo_location) {
        console.log('Using location from profile:', profile.geo_location);
        setUserLocation(profile.geo_location);
        calculateServicesDistances(profile.geo_location.latitude, profile.geo_location.longitude);
        return;
      }

      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Got precise location:', latitude, longitude);
          setUserLocation({ latitude, longitude });
          
          calculateServicesDistances(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError(`Unable to retrieve your precise location: ${error.message}. Please enable location services.`);
          setIsLoading(false);
          
          // Fallback to approximate location (Addis Ababa center)
          toast.warning("Using default location in Addis Ababa. For better results, please enable precise location.");
          const defaultLat = 9.0250;
          const defaultLng = 38.7464;
          setUserLocation({ latitude: defaultLat, longitude: defaultLng });
          calculateServicesDistances(defaultLat, defaultLng);
        },
        geoOptions
      );
    };

    const calculateServicesDistances = (latitude: number, longitude: number) => {
      // Calculate distances for all services
      const servicesWithDistance = emergencyServices.map(service => {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          service.location.latitude, 
          service.location.longitude
        );
        return { ...service, distance };
      }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setNearbyServices(servicesWithDistance);
      setIsLoading(false);
    };

    getUserLocation();
  }, [profile]);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    setFilterType('all');
    setSearchQuery('');
    
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Refreshed location with high accuracy:', latitude, longitude);
        setUserLocation({ latitude, longitude });
        
        // Calculate distances for all services
        const servicesWithDistance = emergencyServices.map(service => {
          const distance = calculateDistance(
            latitude, 
            longitude, 
            service.location.latitude, 
            service.location.longitude
          );
          return { ...service, distance };
        }).sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setNearbyServices(servicesWithDistance);
        setIsLoading(false);
        toast.success("Location updated successfully");
      },
      (error) => {
        console.error('Error getting location during refresh:', error);
        setError('Unable to refresh your location. Please ensure location services are enabled.');
        setIsLoading(false);
        toast.error("Failed to update location");
      },
      geoOptions
    );
  };

  const handleCallEmergency = (phone: string) => {
    window.location.href = `tel:${phone}`;
    console.log(`Calling emergency number: ${phone}`);
    toast.info(`Calling ${phone}`);
  };

  // Filter services based on selected type and search query
  const filteredServices = nearbyServices.filter(service => {
    const matchesType = filterType === 'all' || service.type === filterType;
    const matchesSearch = searchQuery === '' || 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.phone.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  // Get background image based on filter type
  const getBackgroundImage = () => {
    if (filterType === 'all') {
      return serviceBackgrounds.default;
    }
    return serviceBackgrounds[filterType as keyof typeof serviceBackgrounds] || serviceBackgrounds.default;
  };

  if (error) {
    return (
      <section className="relative h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Location Access Required</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button onClick={handleRefresh} size="lg">Try Again</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={getBackgroundImage()}
          alt="Emergency services background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency Services Nearby</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Find and call emergency services in your area. Your safety is our priority.
          </p>
          {userLocation && (
            <p className="text-sm mt-2">
              Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-white text-lg">Locating emergency services near you...</p>
          </div>
        ) : (
          <>
            <div className="w-full max-w-4xl mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <Input 
                  placeholder="Search by name, address or phone" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="hospital">Hospitals</SelectItem>
                    <SelectItem value="police">Police Stations</SelectItem>
                    <SelectItem value="fire">Fire Stations</SelectItem>
                    <SelectItem value="clinic">Clinics</SelectItem>
                    <SelectItem value="pharmacy">Pharmacies</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleRefresh} className="md:w-auto border-white text-white hover:bg-white/10">
                  Refresh Location
                </Button>
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-white text-lg mb-4">No emergency services found matching your criteria.</p>
                <Button onClick={() => { setFilterType('all'); setSearchQuery(''); }} variant="outline" className="border-white text-white hover:bg-white/10">
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(service.type)}
                          <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
                        </div>
                        <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                          {service.distance ? `${service.distance.toFixed(1)} km` : 'Unknown'}
                        </span>
                      </div>
                      <CardDescription className="text-white/80">
                        {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span className="text-sm">{service.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{service.phone}</span>
                        </div>
                        <Button 
                          className="w-full mt-2 bg-white/20 hover:bg-white/30"
                          onClick={() => handleCallEmergency(service.phone)}
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
