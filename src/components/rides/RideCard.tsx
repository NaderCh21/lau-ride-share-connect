
import { Ride } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Car, Calendar, Clock, MapPin, User, Users, UserPlus } from "lucide-react";

interface RideCardProps {
  ride: Ride;
  showActions?: boolean;
}

export default function RideCard({ ride, showActions = true }: RideCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { isAuthenticated, user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewRide = () => {
    navigate(`/rides/${ride.id}`);
  };

  const handleRequestRide = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsRequesting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsRequesting(false);
      setIsDialogOpen(false);
      
      toast({
        title: "Ride requested",
        description: "Your request has been sent to the driver.",
      });
    }, 1000);
  };

  const canRequestRide = isAuthenticated && 
    userRole === 'passenger' && 
    ride.availableSeats > 0 && 
    user?.id !== ride.driverId && 
    (!ride.isFemaleOnly || (ride.isFemaleOnly && user?.gender === 'female'));

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow card-hover">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 inline mr-1 text-lau-green" />
                {ride.departureLocation} to {ride.destination}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                {formatDate(ride.departureDate)}
                <span className="mx-1">•</span>
                <Clock className="w-4 h-4 inline mr-1" /> 
                {formatTime(ride.departureTime)}
              </CardDescription>
            </div>
            
            {ride.isFemaleOnly && (
              <Badge variant="outline" className="border-pink-300 text-pink-500">
                Female Only
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {ride.driver?.vehicleInfo.color} {ride.driver?.vehicleInfo.make} {ride.driver?.vehicleInfo.model}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Driver: {ride.driver?.fullName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{ride.availableSeats} seats available</span>
            </div>
            
            {ride.notes && (
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Note:</span> {ride.notes}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2">
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" onClick={handleViewRide}>
              View Details
            </Button>
            
            {showActions && canRequestRide && (
              <Button 
                size="sm" 
                onClick={() => setIsDialogOpen(true)}
                className="bg-lau-green hover:bg-lau-dark"
              >
                <UserPlus className="w-4 h-4 mr-1" /> Request Ride
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Ride</DialogTitle>
            <DialogDescription>
              Are you sure you want to request this ride?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={ride.driver?.profileImage} />
                <AvatarFallback>{ride.driver?.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div>
                <h4 className="font-medium">{ride.driver?.fullName}</h4>
                <p className="text-sm text-muted-foreground">{ride.driver?.email}</p>
              </div>
            </div>
            
            <div className="border rounded-md p-3 bg-muted/50">
              <div className="text-sm space-y-2">
                <p><span className="font-medium">From:</span> {ride.departureLocation}</p>
                <p><span className="font-medium">To:</span> {ride.destination}</p>
                <p><span className="font-medium">Date:</span> {formatDate(ride.departureDate)}</p>
                <p><span className="font-medium">Time:</span> {formatTime(ride.departureTime)}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestRide}
              disabled={isRequesting}
              className="bg-lau-green hover:bg-lau-dark"
            >
              {isRequesting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Requesting...
                </>
              ) : (
                "Confirm Request"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
