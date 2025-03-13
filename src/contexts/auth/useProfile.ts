
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from './types';
import { toast } from 'sonner';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    try {
      if (!profile?.id) {
        throw new Error('Profile ID not found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
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
  }, [profile?.id]);

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
      await updateProfile({ 
        avatar_url: avatarUrl 
      });

      toast.success('Avatar updated successfully');
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  }, [updateProfile]);

  const updateGeoLocation = useCallback(async (userId: string) => {
    try {
      if (!userId) return;

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            const { error } = await supabase
              .from('profiles')
              .update({
                geo_location: { latitude, longitude }
              })
              .eq('id', userId);

            if (error) {
              console.error('Error updating geo location:', error);
            } else {
              // Update local state with the new geo location
              setProfile(prev => 
                prev ? { ...prev, geo_location: { latitude, longitude } } : null
              );
              console.log('Geo location updated successfully');
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
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.id) {
          fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
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
