
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from './types';
import { toast } from 'sonner';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No user ID provided to fetchProfile');
      return null;
    }
    
    // Prevent excessive refetching
    if (fetchCount > 0 && profile?.id === userId) {
      console.log('Skipping profile fetch - already loading or loaded for this user');
      return profile;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setFetchCount(prev => prev + 1);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(error);
        return null;
      }

      console.log('Profile data loaded:', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [profile, fetchCount]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    try {
      if (!updates.id) {
        throw new Error('Profile ID not found');
      }

      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', updates.id)
        .select('*')
        .single();

      if (error) {
        toast.error('Failed to update profile');
        setError(error);
        throw error;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File, userId: string) => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      setIsLoading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast.error('Failed to upload avatar');
        setError(uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update the profile with the new avatar URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select('*')
        .single();
        
      if (error) {
        console.error('Error updating profile with avatar:', error);
        setError(error);
      } else {
        setProfile(data);
      }

      toast.success('Avatar updated successfully');
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateGeoLocation = useCallback(async (userId: string) => {
    try {
      if (!userId) return;
      
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Update location as a string
            const locationString = `${latitude}, ${longitude}`;
            
            const { data, error } = await supabase
              .from('profiles')
              .update({
                location: locationString
              })
              .eq('id', userId)
              .select('*')
              .single();

            if (error) {
              console.error('Error updating location:', error);
              setError(error);
            } else {
              // Update local state with the new location
              setProfile(data);
              console.log('Location updated successfully');
            }
          },
          (error) => {
            console.error('Error getting geo location:', error);
            setError(error instanceof Error ? error : new Error(String(error)));
          }
        );
      }
    } catch (error) {
      console.error('Error in updateGeoLocation:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  // Clear auth state listener to prevent memory leaks
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setFetchCount(0);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    updateGeoLocation,
  };
};
