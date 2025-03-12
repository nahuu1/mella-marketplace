
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        setCurrentUser(newSession?.user || null);
        
        if (event === 'SIGNED_OUT') {
          setIsLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session retrieved:", session?.user?.id);
        
        setSession(session);
        setCurrentUser(session?.user || null);
        
        // Finalize loading state after a short delay to allow other components to initialize
        setTimeout(() => {
          setIsLoading(false);
          setAuthInitialized(true);
        }, 500);
      } catch (err) {
        console.error("Auth initialization error:", err);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    currentUser,
    session,
    isLoading,
    setCurrentUser,
    setSession,
    setIsLoading,
  };
};
