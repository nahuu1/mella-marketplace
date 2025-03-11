import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

// Define the User type
interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  email: string | null;
}

// Define the AuthContextType
interface AuthContextType {
  currentUser: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  profile: null,
  session: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  uploadAvatar: async () => null,
});

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user || null);
        setIsLoading(true);

        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
          } else if (data) {
            setProfile(data);
          }
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Initial session fetch
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setCurrentUser(session?.user || null);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setProfile(data);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Failed to login. Please check your credentials.";
      
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many failed login attempts. Please try again later.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Signup function - Modified to skip email confirmation
  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      
      // If we have a user, attempt to sign them in immediately
      if (data.user) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (loginError) throw loginError;
        
        toast.success("Account created and logged in successfully!");
      } else {
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = "Failed to create account.";
      
      if (error instanceof AuthError) {
        if (error.message.includes('already exists')) {
          errorMessage = "Email is already in use.";
        } else if (error.message.includes('password')) {
          errorMessage = "Password is too weak.";
        } else if (error.message.includes('email')) {
          errorMessage = "Invalid email address.";
        }
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out.");
      throw error;
    }
  };

  // Upload avatar function
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      if (!currentUser) throw new Error("No user is logged in");
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error("Failed to upload avatar.");
      return null;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!currentUser) throw new Error("No user is logged in");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      // Update local profile state
      if (profile) {
        setProfile({ ...profile, ...data });
      }
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error("Failed to update profile.");
      throw error;
    }
  };

  const value = {
    currentUser,
    profile,
    session,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
