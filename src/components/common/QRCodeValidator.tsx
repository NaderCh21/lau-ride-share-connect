
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface QRCodeValidatorProps {
  bookingId: string;
  qrCodeUrl: string;
  rideDetails: string;
}

export default function QRCodeValidator({ bookingId, qrCodeUrl, rideDetails }: QRCodeValidatorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const { toast } = useToast();

  const handleOpenQR = () => {
    setIsDialogOpen(true);
  };

  const handleScanQR = () => {
    // In a real application, this would open a camera to scan a QR code
    // For demo, we'll simulate a successful scan
    setTimeout(() => {
      setIsValidated(true);
      toast({
        title: "QR Code Validated",
        description: "Identity confirmed successfully.",
      });
    }, 1500);
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={handleOpenQR}
        className="w-full"
      >
        {isValidated ? "Identity Verified ✓" : "Verify Identity (QR Code)"}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Identity Verification</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-sm text-gray-600 mb-2">
              {isValidated 
                ? "Identity has been verified successfully!" 
                : "Show this QR code to the other person to verify identity"}
            </p>
            
            <div className="border p-4 rounded-md bg-white w-64 h-64 flex items-center justify-center">
              {/* Fix: Adding proper rendering for QR code image with error handling */}
              <img 
                src={qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example"} 
                alt="QR Code" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if the image fails to load
                  e.currentTarget.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=fallback";
                }}
              />
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-2">
              Ride: {rideDetails}
            </p>
            
            {!isValidated && (
              <Button onClick={handleScanQR} className="mt-4 bg-green-500 hover:bg-green-600 text-white">
                Scan QR Code
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
