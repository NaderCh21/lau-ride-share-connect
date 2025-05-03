import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { mockRides, mockBookings } from "@/data/mockData";
import { formatDate, formatTime, generateQrCode } from "@/lib/utils";
import { Booking, Ride } from "@/types";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import QRCodeValidator from "@/components/common/QRCodeValidator";
import SOSButton from "@/components/common/SOSButton";
import { useRides } from "@/contexts/RideContext";
import ActiveRideBanner from "@/components/rides/ActiveRideBanner";
import FeedbackDialog from "@/components/rides/FeedbackDialog";
import {
  CheckCircle, AlertTriangle, XCircle, Clock, MapPin, Calendar, Car, MessageSquare,
  PlayCircle, StopCircle
} from "lucide-react";

export default function BookingsPage() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const { bookings: contextBookings, startRide, finishRide } = useRides();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offeredRides, setOfferedRides] = useState<Ride[]>([]);
  const [currentTab, setCurrentTab] = useState("upcoming");
  const [feedbackBooking, setFeedbackBooking] = useState<Booking | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  useEffect(() => {
    if (user) {
      // For passengers - fetch their bookings
      if (userRole === "passenger") {
        // Use bookings from context or fallback to mock data
        const userBookings = contextBookings.length > 0 
          ? contextBookings
          : mockBookings.filter(booking => booking.passengerId === user.id);
        setBookings(userBookings);
      }
      
      // For drivers - fetch rides they've offered
      if (userRole === "driver") {
        const userRides = mockRides.filter(ride => ride.driverId === user.id);
        setOfferedRides(userRides);
      }
    }
  }, [user, userRole, contextBookings]);

  const filterBookingsByStatus = (status: 'upcoming' | 'past' | 'cancelled') => {
    const now = new Date();
    
    if (status === 'upcoming') {
      return bookings.filter(booking => {
        const ride = booking.ride;
        if (!ride) return false;
        
        const rideDate = new Date(`${ride.departureDate}T${ride.departureTime}`);
        return rideDate > now && (booking.status === 'approved' || booking.status === 'pending');
      });
    } else if (status === 'past') {
      return bookings.filter(booking => {
        const ride = booking.ride;
        if (!ride) return false;
        
        const rideDate = new Date(`${ride.departureDate}T${ride.departureTime}`);
        return (rideDate < now && booking.status !== 'cancelled') || 
               booking.status === 'completed' || 
               (booking.punchedIn && booking.punchedOut);
      });
    } else {
      return bookings.filter(booking => booking.status === 'cancelled' || booking.status === 'rejected');
    }
  };

  const filterRidesByStatus = (status: 'upcoming' | 'past' | 'cancelled') => {
    const now = new Date();
    
    if (status === 'upcoming') {
      return offeredRides.filter(ride => {
        const rideDate = new Date(`${ride.departureDate}T${ride.departureTime}`);
        return rideDate > now && ride.status !== 'cancelled';
      });
    } else if (status === 'past') {
      return offeredRides.filter(ride => {
        const rideDate = new Date(`${ride.departureDate}T${ride.departureTime}`);
        return rideDate < now && ride.status !== 'cancelled';
      });
    } else {
      return offeredRides.filter(ride => ride.status === 'cancelled');
    }
  };

  const handlePunchIn = (bookingId: string) => {
    startRide(bookingId);
  };

  const handlePunchOut = (bookingId: string) => {
    finishRide(bookingId);
    
    // Find the completed booking to show feedback dialog
    const completedBooking = bookings.find(b => b.id === bookingId);
    if (completedBooking) {
      setFeedbackBooking(completedBooking);
      setShowFeedbackDialog(true);
    }
  };

  const handleApproveRequest = (bookingId: string) => {
    // In a real application, this would call an API to approve the booking
    toast({
      title: "Request Approved",
      description: "You have approved the passenger's request.",
    });
  };

  const handleRejectRequest = (bookingId: string) => {
    // In a real application, this would call an API to reject the booking
    toast({
      title: "Request Rejected",
      description: "You have rejected the passenger's request.",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Active Ride Banner */}
        <ActiveRideBanner onFinish={handlePunchOut} />
        
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            {userRole === "passenger" ? "My Bookings" : "My Rides"}
          </h1>

          <Tabs defaultValue="upcoming" value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            {/* Passenger View */}
            {userRole === "passenger" && (
              <>
                <TabsContent value="upcoming" className="animate-fade-in">
                  {filterBookingsByStatus('upcoming').length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filterBookingsByStatus('upcoming').map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onPunchIn={() => handlePunchIn(booking.id)}
                          onPunchOut={() => handlePunchOut(booking.id)}
                          userRole={userRole}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      message="You don't have any upcoming bookings" 
                      action={
                        <Button className="bg-lau-green hover:bg-lau-dark" asChild>
                          <Link to="/rides">Find a Ride</Link>
                        </Button>
                      }
                    />
                  )}
                </TabsContent>

                <TabsContent value="past" className="animate-fade-in">
                  {filterBookingsByStatus('past').length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filterBookingsByStatus('past').map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking}
                          userRole={userRole}
                          isPast
                          onFeedback={() => {
                            setFeedbackBooking(booking);
                            setShowFeedbackDialog(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="You don't have any past bookings" />
                  )}
                </TabsContent>

                <TabsContent value="cancelled" className="animate-fade-in">
                  {filterBookingsByStatus('cancelled').length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filterBookingsByStatus('cancelled').map(booking => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking}
                          userRole={userRole}
                          isCancelled
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="You don't have any cancelled bookings" />
                  )}
                </TabsContent>
              </>
            )}

            {/* Driver View */}
            {userRole === "driver" && (
              <>
                <TabsContent value="upcoming" className="animate-fade-in">
                  {filterRidesByStatus('upcoming').length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filterRidesByStatus('upcoming').map(ride => (
                        <RideManagementCard 
                          key={ride.id} 
                          ride={ride} 
                          onApprove={handleApproveRequest}
                          onReject={handleRejectRequest}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      message="You don't have any upcoming rides" 
                      action={
                        <Button className="bg-lau-green hover:bg-lau-dark" asChild>
                          <Link to="/rides/create">Offer a Ride</Link>
                        </Button>
                      }
                    />
                  )}
                </TabsContent>

                <TabsContent value="past" className="animate-fade-in">
                  {filterRidesByStatus('past').length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filterRidesByStatus('past').map(ride => (
                        <RideManagementCard 
                          key={ride.id} 
                          ride={ride} 
                          isPast
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="You don't have any past rides" />
                  )}
                </TabsContent>

                <TabsContent value="cancelled" className="animate-fade-in">
                  {filterRidesByStatus('cancelled').length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {filterRidesByStatus('cancelled').map(ride => (
                        <RideManagementCard 
                          key={ride.id} 
                          ride={ride} 
                          isCancelled
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="You don't have any cancelled rides" />
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>

        <SOSButton />
        
        {/* Feedback Dialog */}
        {feedbackBooking && (
          <FeedbackDialog 
            booking={feedbackBooking}
            isOpen={showFeedbackDialog}
            onClose={() => setShowFeedbackDialog(false)}
          />
        )}
      </div>
    </Layout>
  );
}

function BookingCard({ 
  booking, 
  onPunchIn, 
  onPunchOut, 
  onFeedback,
  userRole,
  isPast = false,
  isCancelled = false
}: { 
  booking: Booking;
  onPunchIn?: () => void;
  onPunchOut?: () => void;
  onFeedback?: () => void;
  userRole: string;
  isPast?: boolean;
  isCancelled?: boolean;
}) {
  if (!booking.ride) return null;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="w-5 h-5 inline mr-1 text-lau-green" />
              {booking.ride.departureLocation} to {booking.ride.destination}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              {formatDate(booking.ride.departureDate)}
              <span className="mx-1">•</span>
              <Clock className="w-4 h-4 inline mr-1" /> 
              {formatTime(booking.ride.departureTime)}
            </CardDescription>
          </div>
          
          <div>
            {booking.status === 'pending' && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
            {booking.status === 'approved' && !booking.punchedIn && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
            {booking.punchedIn && !booking.punchedOut && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <PlayCircle className="w-3 h-3 mr-1" />
                In Progress
              </Badge>
            )}
            {booking.punchedIn && booking.punchedOut && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {booking.status === 'rejected' && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <XCircle className="w-3 h-3 mr-1" />
                Rejected
              </Badge>
            )}
            {booking.status === 'cancelled' && (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                <XCircle className="w-3 h-3 mr-1" />
                Cancelled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              {booking.ride.driver?.vehicleInfo.color} {booking.ride.driver?.vehicleInfo.make} {booking.ride.driver?.vehicleInfo.model}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={booking.ride.driver?.profileImage} />
                <AvatarFallback>
                  {booking.ride.driver?.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {booking.ride.driver?.fullName}
                </p>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">
                    Driver
                  </span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="flex items-center" asChild>
              <a href={`mailto:${booking.ride.driver?.email}`}>
                <MessageSquare className="w-3 h-3 mr-1" />
                Contact
              </a>
            </Button>
          </div>
          
          {booking.status === 'approved' && !isPast && !isCancelled && (
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-3">Ride Check-in</h4>
              
              {!booking.punchedIn && (
                <>
                  <p className="text-xs text-gray-500 mb-2">
                    Use the QR code to verify identity with the driver
                  </p>
                  <QRCodeValidator
                    bookingId={booking.id}
                    qrCodeUrl={booking.qrCode || generateQrCode(booking.id)}
                    rideDetails={`${booking.ride.departureLocation} to ${booking.ride.destination} - ${formatDate(booking.ride.departureDate)}`}
                  />
                  
                  <Button
                    className="w-full mt-2 bg-lau-green hover:bg-lau-dark flex items-center justify-center"
                    onClick={onPunchIn}
                  >
                    <PlayCircle className="mr-2" /> Start Ride
                  </Button>
                </>
              )}
              
              {booking.punchedIn && !booking.punchedOut && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ride in progress
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                    onClick={onPunchOut}
                  >
                    <StopCircle className="mr-2" /> End Ride
                  </Button>
                </div>
              )}
              
              {booking.punchedIn && booking.punchedOut && (
                <div className="space-y-2">
                  <p className="text-sm text-blue-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ride completed
                  </p>
                  <Button
                    className="w-full bg-lau-green hover:bg-lau-dark"
                    onClick={onFeedback}
                  >
                    Rate this Ride
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Show Rate button for past rides */}
          {isPast && booking.punchedOut && onFeedback && (
            <div className="border-t pt-4 mt-2">
              <Button
                variant="outline"
                className="w-full hover:bg-gray-50"
                onClick={onFeedback}
              >
                <Star className="mr-2" /> Rate this Ride
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <div className="px-6 pb-4">
        <Button variant="ghost" className="w-full" asChild>
          <Link to={`/rides/${booking.ride.id}`}>
            View Ride Details
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function RideManagementCard({ 
  ride, 
  onApprove, 
  onReject,
  isPast = false,
  isCancelled = false
}: {
  ride: Ride;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  isPast?: boolean;
  isCancelled?: boolean;
}) {
  const [showRequests, setShowRequests] = useState(false);
  
  // For demo purposes, we'll simulate some bookings
  const pendingBookings = mockBookings.filter(
    booking => booking.rideId === ride.id && booking.status === 'pending'
  );
  
  const approvedBookings = mockBookings.filter(
    booking => booking.rideId === ride.id && booking.status === 'approved'
  );
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader>
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
          
          <div>
            {ride.status === 'pending' && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
            {ride.status === 'approved' && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
            {ride.status === 'cancelled' && (
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <XCircle className="w-3 h-3 mr-1" />
                Cancelled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">Available Seats:</span> {ride.availableSeats}
            </p>
            <p className="text-sm">
              <span className="font-medium">Booked Seats:</span> {approvedBookings.length}
            </p>
          </div>
          
          <div>
            <p className="text-sm">
              <span className="font-medium">Pending Requests:</span> {pendingBookings.length}
            </p>
          </div>
        </div>
        
        {pendingBookings.length > 0 && !isPast && !isCancelled && (
          <>
            <Button 
              variant="outline" 
              className="w-full mb-4"
              onClick={() => setShowRequests(!showRequests)}
            >
              {showRequests ? "Hide Requests" : `View ${pendingBookings.length} Pending Requests`}
            </Button>
            
            {showRequests && (
              <div className="space-y-4 mb-4">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={booking.passenger?.profileImage} />
                          <AvatarFallback>
                            {booking.passenger?.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {booking.passenger?.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.passenger?.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => onReject && onReject(booking.id)}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-lau-green hover:bg-lau-dark"
                          onClick={() => onApprove && onApprove(booking.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {approvedBookings.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Approved Passengers</h4>
            <div className="space-y-2">
              {approvedBookings.map(booking => (
                <div key={booking.id} className="flex items-center gap-2 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={booking.passenger?.profileImage} />
                    <AvatarFallback>
                      {booking.passenger?.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{booking.passenger?.fullName}</span>
                  {booking.punchedIn && !booking.punchedOut && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">Active</Badge>
                  )}
                  {booking.punchedIn && booking.punchedOut && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">Completed</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <div className="px-6 pb-4">
        <Button variant="ghost" className="w-full" asChild>
          <Link to={`/rides/${ride.id}`}>
            View Ride Details
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-medium mb-2">{message}</h3>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
