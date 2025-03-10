
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const headerClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-8",
    {
      "py-4 bg-transparent": !isScrolled && !isMenuOpen,
      "py-2 bg-white/80 backdrop-blur-lg shadow-sm": isScrolled || isMenuOpen
    }
  );

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tight relative z-10"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Mella
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/explore" className="text-sm font-medium hover:text-primary/70 transition-colors">
            Explore
          </Link>
          <Link to="/houses" className="text-sm font-medium hover:text-primary/70 transition-colors">
            Houses
          </Link>
          <Link to="/cars" className="text-sm font-medium hover:text-primary/70 transition-colors">
            Cars
          </Link>
          <Link to="/services" className="text-sm font-medium hover:text-primary/70 transition-colors">
            Services
          </Link>
          <Link to="/products" className="text-sm font-medium hover:text-primary/70 transition-colors">
            Products
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-full px-4">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <User className="h-4 w-4" />
          </Button>
          <Button size="sm" className="rounded-full px-4">
            Sign in
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden relative z-10"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 transition-all" />
          ) : (
            <Menu className="h-6 w-6 transition-all" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-0 flex flex-col items-center justify-center transition-all duration-300 md:hidden",
            {
              "opacity-100 pointer-events-auto": isMenuOpen,
              "opacity-0 pointer-events-none": !isMenuOpen
            }
          )}
        >
          <nav className="flex flex-col items-center space-y-6">
            <Link 
              to="/explore" 
              className="text-xl font-medium hover:text-primary/70 transition-colors"
              onClick={toggleMenu}
            >
              Explore
            </Link>
            <Link 
              to="/houses" 
              className="text-xl font-medium hover:text-primary/70 transition-colors"
              onClick={toggleMenu}
            >
              Houses
            </Link>
            <Link 
              to="/cars" 
              className="text-xl font-medium hover:text-primary/70 transition-colors"
              onClick={toggleMenu}
            >
              Cars
            </Link>
            <Link 
              to="/services" 
              className="text-xl font-medium hover:text-primary/70 transition-colors"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link 
              to="/products" 
              className="text-xl font-medium hover:text-primary/70 transition-colors"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <div className="pt-6 flex flex-col space-y-4 w-full items-center">
              <Button variant="outline" className="rounded-full w-48">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button className="rounded-full w-48">
                Sign in
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
