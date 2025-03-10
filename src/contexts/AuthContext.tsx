
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the User type
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

// Define the AuthContextType
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Firebase authentication for now
  useEffect(() => {
    // This will be replaced with Firebase auth state listener
    const checkAuthState = async () => {
      // Simulate checking authentication state
      const storedUser = localStorage.getItem('mellaUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // This will be replaced with Firebase authentication
      // Mock user for now
      const user = {
        uid: '123456',
        email: email,
        displayName: 'Abebe Kebede',
        photoURL: null,
        phoneNumber: '+251 91 234 5678',
      };
      
      setCurrentUser(user);
      localStorage.setItem('mellaUser', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      // This will be replaced with Firebase authentication
      // Mock user for now
      const user = {
        uid: '123456',
        email: email,
        displayName: name,
        photoURL: null,
        phoneNumber: null,
      };
      
      setCurrentUser(user);
      localStorage.setItem('mellaUser', JSON.stringify(user));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // This will be replaced with Firebase authentication
      setCurrentUser(null);
      localStorage.removeItem('mellaUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      // This will be replaced with Firebase profile update
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        localStorage.setItem('mellaUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
