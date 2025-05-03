import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function SOSButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmergencySubmitted, setIsEmergencySubmitted] = useState(false);
  const [isSOSSheetOpen, setIsSOSSheetOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSOS = () => {
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
      <Button 
        variant="destructive" 
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40 animate-pulse" 
        onClick={handleSOS}
      >
        <AlertTriangle className="w-6 h-6" />
        <span className="sr-only">SOS</span>
      </Button>

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
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsSOSSheetOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Keep the original dialog for backward compatibility, but don't show it */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" /> Emergency Alert
            </DialogTitle>
            <DialogDescription>
              {!isEmergencySubmitted ? (
                <>
                  <p className="mb-4 mt-2">
                    Are you in danger or experiencing an emergency situation? Confirm to send an alert to our support team.
                  </p>
                  <p className="font-medium">
                    We will immediately notify the support team with your:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Name: {user?.fullName}</li>
                      <li>Current ride details</li>
                      <li>Current location (GPS coordinates)</li>
                    </ul>
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p>Sending emergency alert...</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
