
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, MapPin } from "lucide-react";

const heroBackgrounds = [
  {
    url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
    alt: "Ethiopian traditional home with stunning landscape view",
    location: "Addis Ababa, Ethiopia"
  },
  {
    url: "https://images.unsplash.com/photo-1574236170880-c970673c1a4a",
    alt: "Modern apartment in Addis Ababa city center",
    location: "Bole, Addis Ababa"
  },
  {
    url: "https://images.unsplash.com/photo-1523544924505-e04172840238",
    alt: "Luxurious villa in the outskirts of Addis Ababa",
    location: "Entoto, Ethiopia"
  }
];

export function Hero() {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    // Preload all images
    heroBackgrounds.forEach((background, index) => {
      const img = new Image();
      img.src = background.url;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, []);

  useEffect(() => {
    if (imagesLoaded.every(loaded => loaded)) {
      setIsLoading(false);
    }
  }, [imagesLoaded]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBackground((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {/* Background Images */}
      {heroBackgrounds.map((background, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: currentBackground === index ? 1 : 0,
            zIndex: currentBackground === index ? 0 : -10,
          }}
        >
          <img
            src={background.url}
            alt={background.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-white">
        <div 
          className="max-w-4xl mx-auto text-center space-y-6"
          style={{ marginTop: "5rem" }}
        >
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium">
                {heroBackgrounds[currentBackground].location}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight animate-slide-up">
            Find Your Perfect Space <br/> in Ethiopia
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Discover houses, cars, services, and products near you. 
            Join the fastest growing marketplace in Ethiopia.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 animate-slide-up animation-delay-400">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 transition-all rounded-full w-full sm:w-auto"
            >
              Explore Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 transition-all rounded-full w-full sm:w-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Nearby
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-2">
          {heroBackgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBackground(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBackground === index 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`View slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
