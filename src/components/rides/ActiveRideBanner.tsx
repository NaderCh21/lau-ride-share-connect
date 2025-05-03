
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRides } from "@/contexts/RideContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertTriangle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ActiveRideBannerProps {
  onFinish: (bookingId: string) => void;
}

export default function ActiveRideBanner({ onFinish }: ActiveRideBannerProps) {
  const { activeRide } = useRides();
  const [isSOSSheetOpen, setIsSOSSheetOpen] = useState(false);
  const [isEmergencySubmitted, setIsEmergencySubmitted] = useState(false);
  const { toast } = useToast();
  
  if (!activeRide || !activeRide.punchedIn || activeRide.punchedOut) {
    return null;
  }

  const driverName = activeRide.ride?.driver?.fullName || "Your driver";
  
  const handleSOSClick = () => {
    setIsSOSSheetOpen(true);
  };

  const handleEmergencyAction = (actionType: string) => {
    // In a real application, this would trigger the appropriate emergency response
    setIsEmergencySubmitted(true);
    
    // Mock sending emergency alert
    setTimeout(() => {
      toast({
        title: `${actionType} Alert Sent`,
        description: "Help is on the way.",
        variant: "destructive",
      });
      setIsSOSSheetOpen(false);
      setIsEmergencySubmitted(false);
    }, 1500);
  };
  
  return (
    <>
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
            <Button 
              variant="destructive" 
              size="sm" 
              className="font-bold"
              onClick={handleSOSClick}
            >
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

      {/* Emergency Assistance Sheet */}
      <Sheet open={isSOSSheetOpen} onOpenChange={setIsSOSSheetOpen}>
        <SheetContent className="sm:max-w-md w-full">
          <SheetHeader className="text-left border-b pb-4">
            <SheetTitle className="text-2xl font-bold">Emergency Assistance</SheetTitle>
            <SheetDescription className="text-lg">
              Do you need immediate help?
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col gap-4 py-6">
            <Button 
              className="w-full py-6 text-lg bg-blue-500 hover:bg-blue-600"
              onClick={() => handleEmergencyAction("Police")}
              disabled={isEmergencySubmitted}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Police
            </Button>
            
            <Button 
              className="w-full py-6 text-lg bg-red-500 hover:bg-red-600"
              onClick={() => handleEmergencyAction("Ambulance")}
              disabled={isEmergencySubmitted}
              variant="destructive"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Ambulance
            </Button>
            
            <Button 
              className="w-full py-6 text-lg bg-green-500 hover:bg-green-600"
              onClick={() => handleEmergencyAction("LAU Security")}
              disabled={isEmergencySubmitted}
              variant="success"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call LAU Security
            </Button>
          </div>
          
          {isEmergencySubmitted ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p>Contacting emergency services...</p>
            </div>
          ) : (
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setIsSOSSheetOpen(false)}>
                Cancel
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
