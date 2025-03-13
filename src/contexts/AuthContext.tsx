
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthState } from './auth/useAuthState';
import { useProfile } from './auth/useProfile';
import { authOperations } from './auth/authOperations';
import type { AuthContextType } from './auth/types';

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
  updateGeoLocation: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, session, isLoading, authInitialized } = useAuthState();
  const { 
    profile, 
    isLoading: profileLoading,
    updateProfile, 
    uploadAvatar, 
    updateGeoLocation: updateGeo,
    fetchProfile
  } = useProfile();
  
  // Fetch profile when user changes
  useEffect(() => {
    if (currentUser?.id && !profileLoading && authInitialized) {
      console.log("Fetching profile for current user:", currentUser.id);
      fetchProfile(currentUser.id);
    }
  }, [currentUser?.id, fetchProfile, profileLoading, authInitialized]);
  
  // Update geo location whenever the user logs in
  useEffect(() => {
    if (currentUser?.id && !isLoading && authInitialized) {
      updateGeo(currentUser.id);
    }
  }, [currentUser?.id, isLoading, updateGeo, authInitialized]);
  
  const updateGeoLocation = async () => {
    if (currentUser?.id) {
      await updateGeo(currentUser.id);
    }
  };
  
  // Enhanced logout function that clears device session
  const enhancedLogout = async () => {
    try {
      await authOperations.logout();
      // Clear session storage on logout
      localStorage.removeItem('sessionDevice');
      localStorage.removeItem('sessionId');
    } catch (error) {
      console.error("Enhanced logout error:", error);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    profile,
    session,
    isLoading: isLoading || profileLoading,
    login: authOperations.login,
    signup: authOperations.signup,
    logout: enhancedLogout,
    updateProfile,
    uploadAvatar: (file: File) => uploadAvatar(file, currentUser?.id || ''),
    updateGeoLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
