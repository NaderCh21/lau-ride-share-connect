
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRides } from "@/contexts/RideContext";
import { Booking } from "@/types";

interface ActiveRideBannerProps {
  onFinish: (bookingId: string) => void;
}

export default function ActiveRideBanner({ onFinish }: ActiveRideBannerProps) {
  const { activeRide } = useRides();
  
  if (!activeRide || !activeRide.punchedIn || activeRide.punchedOut) {
    return null;
  }

  const driverName = activeRide.ride?.driver?.fullName || "Your driver";
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-lau-dark text-white p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white">
            <AvatarImage src={activeRide.ride?.driver?.profileImage} />
            <AvatarFallback>
              {driverName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium text-lg">Ride in progress</span>
            <p className="text-sm text-gray-200">with {driverName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="font-bold">
            SOS
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 font-bold text-white" 
            size="sm" 
            onClick={() => onFinish(activeRide.id)}
          >
            Finish Ride
          </Button>
        </div>
      </div>
    </div>
  );
}
