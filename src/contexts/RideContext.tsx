
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockRides } from '@/data/mockData';
import { Ride, Booking, Rating } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface RideContextType {
  rides: Ride[];
  addRide: (ride: Omit<Ride, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  getRide: (id: string) => Ride | undefined;
  loading: boolean;
  bookings: Booking[];
  startRide: (bookingId: string) => void;
  finishRide: (bookingId: string) => void;
  submitFeedback: (rideId: string, rating: number, comment: string) => void;
  activeRide: Booking | null;
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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeRide, setActiveRide] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    setRides(mockRides);
    
    // Initialize bookings (this would normally come from an API)
    const mockBookings: Booking[] = [];
    mockRides.forEach(ride => {
      mockBookings.push({
        id: `booking-${ride.id}`,
        rideId: ride.id,
        ride: ride,
        passengerId: 'user1', // Mock passenger ID
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        punchedIn: false,
        punchedOut: false
      });
    });
    
    setBookings(mockBookings);
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

  // Start a ride (punch in)
  const startRide = (bookingId: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => {
        if (booking.id === bookingId) {
          const updatedBooking = {
            ...booking,
            punchedIn: true,
            punchInTime: new Date().toISOString(),
            status: 'approved' as const
          };
          setActiveRide(updatedBooking);
          return updatedBooking;
        }
        return booking;
      })
    );
    
    toast({
      title: "Ride started",
      description: "You've successfully started the ride. Have a safe journey!",
    });
  };

  // Finish a ride (punch out)
  const finishRide = (bookingId: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            punchedOut: true,
            punchOutTime: new Date().toISOString(),
            status: 'completed' as const
          };
        }
        return booking;
      })
    );
    
    setActiveRide(null);
    
    toast({
      title: "Ride completed",
      description: "Your ride has been completed. Please rate your experience.",
    });
  };

  // Submit feedback for a ride
  const submitFeedback = (rideId: string, rating: number, comment: string) => {
    // In a real app, this would save to a database
    // For now, we just show a toast
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback!",
    });
  };

  return (
    <RideContext.Provider value={{ 
      rides, 
      addRide, 
      getRide, 
      loading, 
      bookings, 
      startRide, 
      finishRide, 
      submitFeedback,
      activeRide 
    }}>
      {children}
    </RideContext.Provider>
  );
};
