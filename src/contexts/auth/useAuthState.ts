
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useProfile } from './useProfile';
import { toast } from "sonner";

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const { profile, setProfile, fetchUserProfile } = useProfile();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        setSession(session);
        setCurrentUser(session?.user || null);
        
        if (session?.user) {
          try {
            await fetchUserProfile(session.user.id);
          } catch (error) {
            console.error("Error fetching profile after auth change:", error);
          }
        } else {
          setProfile(null);
          if (authInitialized) {
            setIsLoading(false);
          }
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

        if (session?.user) {
          try {
            await fetchUserProfile(session.user.id);
          } catch (error) {
            console.error("Error fetching initial profile:", error);
          }
        }
        setIsLoading(false);
        setAuthInitialized(true);
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
