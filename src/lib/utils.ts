
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateQrCode(bookingId: string): string {
  // In a real application, this would generate a real QR code
  // For demo purposes, we'll return a placeholder URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=booking_${bookingId}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(timeString: string): string {
  // Handle both time formats: "14:30" and ISO strings
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Handle "HH:MM" format
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isAfterCurrentTime(date: string, time: string): boolean {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  const rideDateTime = new Date(year, month - 1, day, hours, minutes);
  const currentTime = new Date();
  
  return rideDateTime > currentTime;
}

export function getTimeDifference(date: string, time: string): number {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  const rideDateTime = new Date(year, month - 1, day, hours, minutes);
  const currentTime = new Date();
  
  // Return difference in hours
  return (rideDateTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
}

export function canCancelRide(date: string, time: string): boolean {
  // Passenger can cancel at least 12 hours before
  const timeDiff = getTimeDifference(date, time);
  return timeDiff >= 12;
}

export function canDeleteRide(date: string, time: string): boolean {
  // Driver can delete at least 24 hours before
  const timeDiff = getTimeDifference(date, time);
  return timeDiff >= 24;
}
