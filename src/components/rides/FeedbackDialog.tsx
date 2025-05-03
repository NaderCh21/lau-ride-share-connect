
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useRides } from "@/contexts/RideContext";
import { Booking } from "@/types";

interface FeedbackDialogProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackDialog({ booking, isOpen, onClose }: FeedbackDialogProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const { submitFeedback } = useRides();
  
  const handleSubmit = () => {
    submitFeedback(booking.rideId, rating, comment);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate your ride</DialogTitle>
          <DialogDescription>
            Share your experience about your ride with {booking.ride?.driver?.fullName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          
          <Textarea
            placeholder="Share your experience (optional)"
            className="min-h-[100px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-lau-green hover:bg-lau-dark" onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
