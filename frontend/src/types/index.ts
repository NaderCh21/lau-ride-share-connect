
// User types
export type UserRole = "driver" | "passenger";
export type Gender = "male" | "female" | "other";
export type UserStatus = "active" | "banned" | "pending";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  gender: Gender;
  campus: string;
  residencyLocation: string;
  contactNumber: string;
  idCardImage?: string;
  profileImage?: string;
  status: UserStatus;
  createdAt: string;
  isVerified: boolean;
}

export interface Driver extends User {
  role: "driver";
  licenseNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
  };
  reportCount: number;
}

export interface Passenger extends User {
  role: "passenger";
}

// Ride types
export type RideStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";

export interface Ride {
  id: string;
  driverId: string;
  driver?: Driver;
  departureLocation: string;
  destination: string;
  departureTime: string;
  departureDate: string;
  availableSeats: number;
  isFemaleOnly: boolean;
  status: RideStatus;
  createdAt: string;
  updatedAt: string;
  route: string;
  notes?: string;
  price?: number;
}

export interface Booking {
  id: string;
  rideId: string;
  ride?: Ride;
  passengerId: string;
  passenger?: Passenger;
  status: RideStatus;
  createdAt: string;
  updatedAt: string;
  punchedIn: boolean;
  punchedOut: boolean;
  punchInTime?: string;
  punchOutTime?: string;
  qrCode?: string;
}

export interface Rating {
  id: string;
  rideId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  fromUserId: string;
  againstUserId: string;
  reason: string;
  details: string;
  status: "pending" | "reviewed" | "actioned" | "dismissed";
  createdAt: string;
}
