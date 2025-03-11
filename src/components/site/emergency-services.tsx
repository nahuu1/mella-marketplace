
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Mock data for emergency services
// In a real app, this would come from a database
const mockEmergencyServices: EmergencyService[] = [
  {
    id: '1',
    name: 'Central Hospital',
    type: 'hospital',
    phone: '+251-111-222-333',
    location: { latitude: 9.0222, longitude: 38.7468 },
    address: '5 Ras Desta Damtew Ave, Addis Ababa',
  },
  {
    id: '2',
    name: 'Police Station',
    type: 'police',
    phone: '+251-111-222-334',
    location: { latitude: 9.0252, longitude: 38.7528 },
    address: 'Bole Road, Addis Ababa',
  },
  {
    id: '3',
    name: 'Fire Department',
    type: 'fire',
    phone: '+251-111-222-335',
    location: { latitude: 9.0302, longitude: 38.7618 },
    address: 'Mexico Square, Addis Ababa',
  },
  {
    id: '4',
    name: 'Community Clinic',
    type: 'clinic',
    phone: '+251-111-222-336',
    location: { latitude: 9.0352, longitude: 38.7458 },
    address: 'Churchill Avenue, Addis Ababa',
  },
  {
    id: '5',
    name: 'Pharmacy Plus',
    type: 'pharmacy',
    phone: '+251-111-222-337',
    location: { latitude: 9.0282, longitude: 38.7498 },
    address: 'Bole Medhanialem, Addis Ababa',
  },
  {
    id: '6',
    name: 'St. Paul\'s Hospital',
    type: 'hospital',
    phone: '+251-111-222-338',
    location: { latitude: 9.0312, longitude: 38.7608 },
    address: 'Swinfen Lane, Addis Ababa',
  },
  {
    id: '7',
    name: 'Rapid Response Clinic',
    type: 'clinic',
    phone: '+251-111-222-339',
    location: { latitude: 9.0232, longitude: 38.7488 },
    address: 'Meskel Square, Addis Ababa',
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
    case 'clinic':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'police':
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
    case 'fire':
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    case 'pharmacy':
      return <AlertCircle className="h-5 w-5 text-green-500" />;
    default:
      return <AlertCircle className="h-5 w-5" />;
  }
};

export const EmergencyServices = () => {
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [nearbyServices, setNearbyServices] = useState<EmergencyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use browser's Geolocation API to get user's location
    const getUserLocation = () => {
      setIsLoading(true);
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          // Calculate distances and filter services within 10km
          const servicesWithDistance = mockEmergencyServices.map(service => {
            const distance = calculateDistance(
              latitude, 
              longitude, 
              service.location.latitude, 
              service.location.longitude
            );
            return { ...service, distance };
          }).filter(service => service.distance && service.distance <= 10)
            .sort((a, b) => (a.distance || 0) - (b.distance || 0));

          setNearbyServices(servicesWithDistance);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location. Please enable location services.');
          setIsLoading(false);
        }
      );
    };

    getUserLocation();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        // Calculate distances and filter services within 10km
        const servicesWithDistance = mockEmergencyServices.map(service => {
          const distance = calculateDistance(
            latitude, 
            longitude, 
            service.location.latitude, 
            service.location.longitude
          );
          return { ...service, distance };
        }).filter(service => service.distance && service.distance <= 10)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        setNearbyServices(servicesWithDistance);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to retrieve your location. Please enable location services.');
        setIsLoading(false);
      }
    );
  };

  if (error) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Emergency Services Nearby</CardTitle>
          <CardDescription>Find emergency services within 10km of your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p className="mb-4">{error}</p>
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Emergency Services Nearby</CardTitle>
          <CardDescription>Finding emergency services within 10km of your location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Emergency Services Nearby</CardTitle>
        <CardDescription>
          {nearbyServices.length 
            ? `Showing ${nearbyServices.length} emergency services within 10km of your location` 
            : 'No emergency services found within 10km of your location'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {nearbyServices.length === 0 ? (
          <div className="text-center p-6">
            <p>No emergency services found within 10km.</p>
            <Button onClick={handleRefresh} className="mt-4">Refresh</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getServiceIcon(service.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{service.name}</h3>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{service.address}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-primary" />
                            <a href={`tel:${service.phone}`} className="text-sm font-medium">{service.phone}</a>
                          </div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {service.distance ? service.distance.toFixed(1) : 0} km
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={handleRefresh} variant="outline">Refresh Location</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
