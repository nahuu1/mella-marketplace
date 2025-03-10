
import { cn } from "@/lib/utils";
import { MapPin, MessageCircle, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Location-Based Discovery",
    description: "Find listings within your area. All listings are only visible to users within a certain radius of the poster's location.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: MessageCircle,
    title: "In-App Chat",
    description: "Connect directly with sellers or buyers through our built-in messaging system before making any commitments.",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Our verification process ensures that all listings are genuine and meet our community standards.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Enjoy our platform in both Amharic and English languages with the option to switch between the two.",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Designed for Ethiopians</h2>
          <p className="text-muted-foreground mt-4">
            Our marketplace is built specifically for Ethiopian users, with features that make finding and selling items and services easier than ever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg transition-all animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                feature.bgColor
              )}>
                <feature.icon className={cn("h-8 w-8", feature.color)} />
              </div>
              
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
