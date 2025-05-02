
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, canCancelRide, canDeleteRide } from "@/lib/utils";
import { mockRides, mockDrivers, mockBookings } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import QRCodeValidator from "@/components/common/QRCodeValidator";
import SOSButton from "@/components/common/SOSButton";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  MessageSquare,
  Flag,
  Calendar,
  Clock,
  MapPin,
  Car,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function RideDetailPage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // Find the ride from mock data
  const ride = mockRides.find(r => r.id === rideId) || mockRides[0];
  const driver = mockDrivers.find(d => d.id === ride.driverId);
  
  // Check if current user is the driver of this ride
  const isDriver = user?.id === ride.driverId;
  
  // Check if user has already booked this ride
  const booking = mockBookings.find(b => b.rideId === ride.id && b.passengerId === user?.id);
  
  const handleRequestRide = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    setIsRequesting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsRequesting(false);
      setShowRequestDialog(false);
      
      toast({
        title: "Ride requested",
        description: "Your request has been sent to the driver.",
      });
    }, 1500);
  };
  
  const handleCancelRide = () => {
    // Simulate API request
    setTimeout(() => {
      setShowCancelDialog(false);
      
      toast({
        title: "Ride cancelled",
        description: "Your ride has been cancelled successfully.",
      });
      
      navigate("/bookings");
    }, 1000);
  };
  
  const handleDeleteRide = () => {
    // Simulate API request
    setTimeout(() => {
      setShowDeleteDialog(false);
      
      toast({
        title: "Ride deleted",
        description: "Your ride has been deleted successfully.",
      });
      
      navigate("/rides");
    }, 1000);
  };
  
  const handleSubmitReport = () => {
    setIsReporting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsReporting(false);
      setShowReportDialog(false);
      
      toast({
        title: "Report submitted",
        description: "Your report has been submitted and will be reviewed by our team.",
      });
      
      setReportReason("");
    }, 1500);
  };
  
  const canCancel = booking && canCancelRide(ride.departureDate, ride.departureTime);
  const canDelete = isDriver && canDeleteRide(ride.departureDate, ride.departureTime);
  
  const canRequestRide = isAuthenticated && 
    user?.role === 'passenger' && 
    ride.availableSeats > 0 && 
    user?.id !== ride.driverId && 
    (!ride.isFemaleOnly || (ride.isFemaleOnly && user?.gender === 'female')) &&
    !booking;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        <MapPin className="w-5 h-5 inline mr-1 text-lau-green" />
                        {ride.departureLocation} to {ride.destination}
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center">
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
                
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-700">Ride Details</h3>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {driver?.vehicleInfo.color} {driver?.vehicleInfo.make} {driver?.vehicleInfo.model}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">Route: {ride.route}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{ride.availableSeats} seats available</span>
                        </div>
                        {ride.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                            <span className="font-medium">Note:</span> {ride.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium text-gray-700">Ride Status</h3>
                        <div className="flex items-center gap-2">
                          {ride.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {ride.status === 'approved' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                          {ride.status === 'cancelled' && (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelled
                            </Badge>
                          )}
                        </div>
                        
                        {booking && (
                          <>
                            <div className="text-sm flex items-center gap-1">
                              <span className="font-medium">Booking Status:</span>
                              {booking.status === 'pending' && (
                                <span className="text-yellow-600">Pending approval</span>
                              )}
                              {booking.status === 'approved' && (
                                <span className="text-green-600">Approved</span>
                              )}
                              {booking.status === 'rejected' && (
                                <span className="text-red-600">Rejected</span>
                              )}
                            </div>
                            
                            {booking.status === 'approved' && (
                              <>
                                <div className="text-sm">
                                  {!booking.punchedIn && (
                                    <div className="text-yellow-600">Not yet punched in</div>
                                  )}
                                  {booking.punchedIn && !booking.punchedOut && (
                                    <div className="text-green-600">Punched in - Ride in progress</div>
                                  )}
                                  {booking.punchedIn && booking.punchedOut && (
                                    <div className="text-blue-600">Ride completed</div>
                                  )}
                                </div>
                                
                                {booking.qrCode && !booking.punchedIn && (
                                  <div className="mt-2">
                                    <QRCodeValidator 
                                      bookingId={booking.id}
                                      qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example"
                                      rideDetails={`${ride.departureLocation} to ${ride.destination} - ${formatDate(ride.departureDate)}`}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t border-dashed pt-4">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="flex gap-2">
                          {booking?.status === 'approved' && booking.punchedIn && booking.punchedOut && (
                            <Button variant="outline" className="flex items-center" asChild>
                              <DialogTrigger onClick={() => {}}>
                                <Star className="w-4 h-4 mr-1" />
                                Rate Ride
                              </DialogTrigger>
                            </Button>
                          )}
                          
                          <Button variant="outline" className="flex items-center" asChild>
                            <a href={`mailto:${driver?.email}`}>
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Contact Driver
                            </a>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="flex items-center text-red-500 hover:text-red-700" 
                            onClick={() => setShowReportDialog(true)}
                          >
                            <Flag className="w-4 h-4 mr-1" />
                            Report
                          </Button>
                        </div>
                        
                        <div>
                          {canCancel && (
                            <Button 
                              variant="outline"
                              className="text-red-500 hover:text-red-700 mr-2" 
                              onClick={() => setShowCancelDialog(true)}
                            >
                              Cancel Booking
                            </Button>
                          )}
                          
                          {canDelete && (
                            <Button 
                              variant="outline"
                              className="text-red-500 hover:text-red-700" 
                              onClick={() => setShowDeleteDialog(true)}
                            >
                              Delete Ride
                            </Button>
                          )}
                          
                          {canRequestRide && (
                            <Button 
                              className="bg-lau-green hover:bg-lau-dark" 
                              onClick={() => setShowRequestDialog(true)}
                            >
                              Request Ride
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Ride Route</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Route Map (Placeholder)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-1/3 space-y-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={driver?.profileImage} />
                      <AvatarFallback>{driver?.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{driver?.fullName}</h3>
                      <p className="text-sm text-gray-500">{driver?.email}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-gray-300 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">4.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Vehicle Information</h4>
                      <p className="text-sm text-gray-600">
                        {driver?.vehicleInfo.color} {driver?.vehicleInfo.make} {driver?.vehicleInfo.model} ({driver?.vehicleInfo.year})
                      </p>
                      <p className="text-sm text-gray-600">
                        Plate Number: {driver?.vehicleInfo.plateNumber}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Campus</h4>
                      <p className="text-sm text-gray-600">{driver?.campus}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Residency Location</h4>
                      <p className="text-sm text-gray-600">{driver?.residencyLocation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Safety Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <p>Verify driver/passenger identity through QR code before the ride.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <p>Share your ride details with a friend or family member.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <p>Use the SOS button in case of emergency.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                      <p>Report any unsafe behavior immediately.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Cancel Booking Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep booking</AlertDialogCancel>
              <Button variant="destructive" onClick={handleCancelRide}>
                Yes, cancel booking
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Ride Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Ride</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this ride? All bookings will be cancelled and passengers will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep ride</AlertDialogCancel>
              <Button variant="destructive" onClick={handleDeleteRide}>
                Yes, delete ride
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Request Ride Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
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
                  <AvatarImage src={driver?.profileImage} />
                  <AvatarFallback>{driver?.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">{driver?.fullName}</h4>
                  <p className="text-sm text-muted-foreground">{driver?.email}</p>
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
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
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

        {/* Report Driver Dialog */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Driver</DialogTitle>
              <DialogDescription>
                Please provide details about the issue you experienced with this driver.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="report-reason" className="block text-sm font-medium mb-1">
                  Reason for Report
                </label>
                <select 
                  id="report-reason"
                  className="w-full p-2 border rounded-md"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="unsafe_driving">Unsafe Driving</option>
                  <option value="inappropriate_behavior">Inappropriate Behavior</option>
                  <option value="late">Excessive Tardiness</option>
                  <option value="cancelled">Cancelled Without Notice</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="report-details" className="block text-sm font-medium mb-1">
                  Details
                </label>
                <textarea 
                  id="report-details"
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="Please provide specific details about the incident..."
                ></textarea>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleSubmitReport}
                disabled={isReporting || !reportReason}
              >
                {isReporting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SOSButton />
      </div>
    </Layout>
  );
}
