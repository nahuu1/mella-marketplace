
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-secondary py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Mella
              </span>
            </Link>
            
            <p className="text-muted-foreground max-w-md">
              Ethiopia's premier marketplace for houses, cars, services, and products. 
              Find what you need, when you need it, right in your area.
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{t("categories")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/houses" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("houses")}
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("cars")}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("products")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="flex items-center justify-center md:justify-end">
            <p className="text-muted-foreground text-center md:text-right font-medium">
              {t("madeBy")}
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mella. {t("allRightsReserved")}
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("terms")}
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("privacy")}
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
