
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4 md:px-8 relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 w-64 h-64 rounded-full bg-white/20"></div>
        <div className="absolute right-10 top-40 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute left-40 bottom-10 w-48 h-48 rounded-full bg-white/20"></div>
        <div className="absolute right-20 -bottom-20 w-72 h-72 rounded-full bg-white/20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Ready to Join?
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              List Your Property or Service in Minutes
            </h2>
            
            <p className="text-primary-foreground/80">
              Join thousands of Ethiopians already using Mella to rent, sell, and buy houses, cars, services, and products. 
              It's free to list and takes less than 5 minutes to get started.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 transition-all"
              >
                Get Started
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-primary-foreground/80">+251 91 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-primary-foreground/80">support@mella.com</p>
                </div>
              </div>
              
              <div className="pt-6">
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/10 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/10 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  
                  <textarea
                    placeholder="Your Message"
                    rows={3}
                    className="w-full p-3 rounded-lg border border-white/20 bg-white/10 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  ></textarea>
                  
                  <Button 
                    className="w-full bg-white text-primary hover:bg-white/90"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
