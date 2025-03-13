
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from './types';
import { toast } from 'sonner';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      console.log('No user ID provided to fetchProfile');
      setIsLoading(false);
      return null;
    }
    
    try {
      setIsLoading(true);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return null;
      }

      console.log('Profile data loaded:', data);
      setProfile(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setIsLoading(false);
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    try {
      if (!updates.id) {
        throw new Error('Profile ID not found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', updates.id)
        .select('*')
        .single();

      if (error) {
        toast.error('Failed to update profile');
        throw error;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File, userId: string) => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        toast.error('Failed to upload avatar');
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
      } else {
        setProfile(data);
      }

      toast.success('Avatar updated successfully');
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  }, []);

  const updateGeoLocation = useCallback(async (userId: string) => {
    try {
      if (!userId) return;

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Instead of using geo_location, update location as a string
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
            } else {
              // Update local state with the new location
              setProfile(data);
              console.log('Location updated successfully');
            }
          },
          (error) => {
            console.error('Error getting geo location:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error in updateGeoLocation:', error);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session?.user?.id) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'USER_UPDATED' && session?.user?.id) {
          await fetchProfile(session.user.id);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    updateGeoLocation,
  };
};
