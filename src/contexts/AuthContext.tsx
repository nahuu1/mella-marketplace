
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
  const { currentUser, session, isLoading } = useAuthState();
  const { 
    profile, 
    updateProfile, 
    uploadAvatar, 
    updateGeoLocation: updateGeo 
  } = useProfile();
  
  // Update geo location whenever the user logs in
  useEffect(() => {
    if (currentUser?.id && !isLoading) {
      updateGeo(currentUser.id);
    }
  }, [currentUser?.id, isLoading]);
  
  const updateGeoLocation = async () => {
    if (currentUser?.id) {
      await updateGeo(currentUser.id);
    }
  };
  
  const value = {
    currentUser,
    profile,
    session,
    isLoading,
    login: authOperations.login,
    signup: authOperations.signup,
    logout: authOperations.logout,
    updateProfile,
    uploadAvatar: (file: File) => uploadAvatar(file, currentUser?.id || ''),
    updateGeoLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
