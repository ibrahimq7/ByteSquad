
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Define the shape of our user object
export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

// Define the shape of our auth context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // In a real app, this would be replaced by Firebase Auth
  // For now, we'll simulate auth with localStorage
  useEffect(() => {
    const user = localStorage.getItem('mindease_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingUsers = JSON.parse(localStorage.getItem('mindease_users') || '[]');
      if (existingUsers.find((user: User) => user.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        displayName,
        photoURL: null
      };
      
      // Save to "database"
      existingUsers.push(newUser);
      localStorage.setItem('mindease_users', JSON.stringify(existingUsers));
      localStorage.setItem('mindease_user', JSON.stringify(newUser));
      
      // Update state
      setCurrentUser(newUser);
      toast({
        title: "Account created!",
        description: "Welcome to MindEase. Your account has been created successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err.message || "Something went wrong. Please try again.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      const existingUsers = JSON.parse(localStorage.getItem('mindease_users') || '[]');
      const user = existingUsers.find((user: User) => user.email === email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, we'd check the password hash
      // Here we're just simulating successful login
      
      localStorage.setItem('mindease_user', JSON.stringify(user));
      setCurrentUser(user);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to MindEase.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: err.message || "Invalid email or password.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Remove user from localStorage
      localStorage.removeItem('mindease_user');
      
      // Update state
      setCurrentUser(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send an email
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser) {
        throw new Error('No user is signed in');
      }
      
      // Update user data
      const updatedUser = { ...currentUser, ...data };
      
      // Update in localStorage
      localStorage.setItem('mindease_user', JSON.stringify(updatedUser));
      
      // Update existing users array
      const existingUsers = JSON.parse(localStorage.getItem('mindease_users') || '[]');
      const updatedUsers = existingUsers.map((user: User) => 
        user.id === currentUser.id ? updatedUser : user
      );
      localStorage.setItem('mindease_users', JSON.stringify(updatedUsers));
      
      // Update state
      setCurrentUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
