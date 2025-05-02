
import { Driver, Passenger, UserRole } from "@/types";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { mockDrivers, mockPassengers } from "@/data/mockData";

interface AuthContextType {
  user: Passenger | Driver | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<Passenger | Driver>) => Promise<void>;
  updateProfile: (userData: Partial<Passenger | Driver>) => Promise<void>;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Passenger | Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in localStorage (for demo purposes)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call
      // For demo, we'll use mock data
      const foundDriver = mockDrivers.find(d => d.email.toLowerCase() === email.toLowerCase());
      const foundPassenger = mockPassengers.find(p => p.email.toLowerCase() === email.toLowerCase());
      
      const foundUser = foundDriver || foundPassenger;
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Simulate password check (in demo we accept any password)
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };
  
  const register = async (userData: Partial<Passenger | Driver>) => {
    setIsLoading(true);
    try {
      // In a real app, this would make an API call
      // For demo, we'll simulate registration
      const baseUserData = {
        id: `u${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "active" as const,
        isVerified: false,
      };
      
      // Create the appropriate user type based on role
      let newUser;
      if (userData.role === "driver") {
        newUser = {
          ...baseUserData,
          ...userData,
          role: "driver" as const, // Ensure TypeScript knows this is a constant "driver"
        } as Driver;
      } else {
        newUser = {
          ...baseUserData,
          ...userData,
          role: "passenger" as const, // Ensure TypeScript knows this is a constant "passenger"
        } as Passenger;
      }
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (userData: Partial<Passenger | Driver>) => {
    if (!user) return Promise.reject(new Error("Not authenticated"));
    
    try {
      // Make sure we're maintaining the correct type
      const updatedUser = {
        ...user,
        ...userData,
        role: user.role, // Preserve the original role to maintain type safety
      } as Driver | Passenger;
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
        userRole: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
