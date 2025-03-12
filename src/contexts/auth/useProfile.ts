
import { useState } from 'react';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { Profile } from './types';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      } else if (data) {
        console.log("Profile fetched:", data);
        setProfile(data);
      } else {
        console.log("No profile found, creating one...");
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{ id: userId }]);
          
        if (createError) {
          console.error("Error creating profile:", createError);
        } else {
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (newProfile) {
            setProfile(newProfile);
          }
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!data.id) {
        throw new Error("User ID is required for profile update");
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);
      
      if (error) throw error;
      
      // Fetch the updated profile to ensure we have the latest data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.id)
        .single();
        
      if (fetchError) throw fetchError;
      
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error("Failed to update profile.");
      throw error;
    }
  };

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      if (userId && data.publicUrl) {
        await updateProfile({
          id: userId,
          avatar_url: data.publicUrl
        });
      }
      
      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error("Failed to upload avatar.");
      return null;
    }
  };

  const updateGeoLocation = async (userId: string) => {
    if (!userId) return;
    
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const geoLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            
            const { error } = await supabase
              .from('profiles')
              .update({
                geo_location: geoLocation,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId);
            
            if (error) throw error;
            
            if (profile) {
              setProfile({
                ...profile,
                geo_location: geoLocation
              });
            }
            
            console.log("Geo location updated successfully!");
          },
          (error) => {
            console.error("Error getting geolocation:", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error('Geo location update error:', error);
    }
  };

  return {
    profile,
    setProfile,
    fetchUserProfile,
    updateProfile,
    uploadAvatar,
    updateGeoLocation,
  };
};
