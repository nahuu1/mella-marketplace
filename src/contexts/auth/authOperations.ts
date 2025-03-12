
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { toast } from "sonner";

export const authOperations = {
  login: async (email: string, password: string) => {
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
  },

  signup: async (email: string, password: string, name: string) => {
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
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out.");
      throw error;
    }
  },
};
