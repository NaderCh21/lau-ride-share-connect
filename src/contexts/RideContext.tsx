
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRides } from '@/data/mockData';
import { Ride } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface RideContextType {
  rides: Ride[];
  addRide: (ride: Omit<Ride, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  getRide: (id: string) => Ride | undefined;
  loading: boolean;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRides = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRides must be used within a RideProvider');
  }
  return context;
};

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    setRides(mockRides);
    setLoading(false);
  }, []);

  // Add a new ride
  const addRide = (rideData: Omit<Ride, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    // Generate a unique ID
    const id = `r${rides.length + 1}`;
    const now = new Date().toISOString();
    
    // Create the new ride object
    const newRide: Ride = {
      ...rideData,
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    // Add to rides state
    setRides(prevRides => [newRide, ...prevRides]);
    
    // Show confirmation toast
    toast({
      title: "Ride created",
      description: "Your ride has been successfully added to the list.",
    });
    
    return newRide;
  };

  // Get a ride by ID
  const getRide = (id: string) => {
    return rides.find(ride => ride.id === id);
  };

  return (
    <RideContext.Provider value={{ rides, addRide, getRide, loading }}>
      {children}
    </RideContext.Provider>
  );
};
