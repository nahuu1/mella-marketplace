
import React, { createContext, useContext, useState, useEffect } from "react";

// Define available languages
export type Language = "en" | "am";

// Define the context type
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "explore": "Explore",
    "houses": "Houses",
    "cars": "Cars",
    "services": "Services",
    "products": "Products",
    "search": "Search",
    "signin": "Sign in",
    "profile": "Profile",
    
    // Footer
    "madeBy": "Made by tech space ET",
    "terms": "Terms",
    "privacy": "Privacy",
    "cookies": "Cookies",
    "allRightsReserved": "All rights reserved.",
    
    // Categories
    "categories": "Categories",
  },
  am: {
    // Navigation
    "explore": "ያስሱ",
    "houses": "ቤቶች",
    "cars": "መኪናዎች",
    "services": "አገልግሎቶች",
    "products": "ምርቶች",
    "search": "ፈልግ",
    "signin": "ግባ",
    "profile": "መገለጫ",
    
    // Footer
    "madeBy": "በቴክ ስፔስ ኢትዮጵያ የተሰራ",
    "terms": "ውሎች",
    "privacy": "ግላዊነት",
    "cookies": "ኩኪዎች",
    "allRightsReserved": "መብቱ በህግ የተጠበቀ ነው።",
    
    // Categories
    "categories": "ምድቦች",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get stored language or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    return storedLanguage && ["en", "am"].includes(storedLanguage) ? storedLanguage : "en";
  });

  // Function to set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
