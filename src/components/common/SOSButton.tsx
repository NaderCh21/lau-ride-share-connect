
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SOSButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmergencySubmitted, setIsEmergencySubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSOS = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitEmergency = () => {
    // In a real application, this would send the emergency alert
    // with location data to the support team
    setIsEmergencySubmitted(true);
    
    // Mock sending emergency alert
    setTimeout(() => {
      toast({
        title: "Emergency Alert Sent",
        description: "Support team has been notified and will contact you shortly.",
        variant: "destructive",
      });
      setIsDialogOpen(false);
      setIsEmergencySubmitted(false);
    }, 2000);
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
          {!isEmergencySubmitted && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSubmitEmergency}>
                Confirm Emergency
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
