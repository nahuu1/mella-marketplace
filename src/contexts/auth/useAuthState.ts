
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          setCurrentUser(newSession?.user || null);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setCurrentUser(null);
          localStorage.removeItem('sessionDevice');
        }
      }
    );

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        setIsLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        // Check if this is a new session/device
        const lastSessionDevice = localStorage.getItem('sessionDevice');
        const currentDevice = navigator.userAgent;
        
        if (session && (!lastSessionDevice || lastSessionDevice !== currentDevice)) {
          console.log("New device or session detected, logging out");
          await supabase.auth.signOut();
          localStorage.removeItem('sessionDevice');
          setSession(null);
          setCurrentUser(null);
        } else if (session) {
          // Set the session device for existing sessions
          localStorage.setItem('sessionDevice', currentDevice);
          setSession(session);
          setCurrentUser(session?.user || null);
        }
        
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
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
    authInitialized,
    setCurrentUser,
    setSession,
    setIsLoading,
  };
};
