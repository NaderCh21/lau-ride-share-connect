
import { Booking, Driver, Passenger, Rating, Report, Ride } from "@/types";

export const mockDrivers: Driver[] = [
  {
    id: "d1",
    fullName: "Ahmad Khalil",
    email: "ahmad.khalil@lau.edu",
    role: "driver",
    gender: "male",
    campus: "Beirut",
    residencyLocation: "Hamra",
    contactNumber: "+961 70 123 456",
    idCardImage: "/placeholder.svg",
    profileImage: "/placeholder.svg",
    status: "active",
    createdAt: "2023-05-01T10:00:00Z",
    isVerified: true,
    licenseNumber: "LB123456",
    vehicleInfo: {
      make: "Toyota",
      model: "Corolla",
      year: "2020",
      color: "White",
      plateNumber: "B 123456",
    },
    reportCount: 0,
  },
  {
    id: "d2",
    fullName: "Sara Haddad",
    email: "sara.haddad@lau.edu",
    role: "driver",
    gender: "female",
    campus: "Byblos",
    residencyLocation: "Jbeil",
    contactNumber: "+961 71 234 567",
    idCardImage: "/placeholder.svg",
    profileImage: "/placeholder.svg",
    status: "active",
    createdAt: "2023-05-02T11:00:00Z",
    isVerified: true,
    licenseNumber: "LB234567",
    vehicleInfo: {
      make: "Honda",
      model: "Civic",
      year: "2019",
      color: "Black",
      plateNumber: "J 234567",
    },
    reportCount: 0,
  },
];

export const mockPassengers: Passenger[] = [
  {
    id: "p1",
    fullName: "Ziad Nassar",
    email: "ziad.nassar@lau.edu",
    role: "passenger",
    gender: "male",
    campus: "Beirut",
    residencyLocation: "Achrafieh",
    contactNumber: "+961 76 345 678",
    idCardImage: "/placeholder.svg",
    profileImage: "/placeholder.svg",
    status: "active",
    createdAt: "2023-05-03T12:00:00Z",
    isVerified: true,
  },
  {
    id: "p2",
    fullName: "Nour Karam",
    email: "nour.karam@lau.edu",
    role: "passenger",
    gender: "female",
    campus: "Byblos",
    residencyLocation: "Jounieh",
    contactNumber: "+961 78 456 789",
    idCardImage: "/placeholder.svg",
    profileImage: "/placeholder.svg",
    status: "active",
    createdAt: "2023-05-04T13:00:00Z",
    isVerified: true,
  },
];

export const mockRides: Ride[] = [
  {
    id: "r1",
    driverId: "d1",
    driver: mockDrivers[0],
    departureLocation: "Hamra",
    destination: "LAU Beirut",
    departureTime: "08:00",
    departureDate: "2023-05-15",
    availableSeats: 3,
    isFemaleOnly: false,
    status: "pending",
    createdAt: "2023-05-10T10:00:00Z",
    updatedAt: "2023-05-10T10:00:00Z",
    route: "Hamra - Ain el Mreisseh - LAU Beirut",
    notes: "Meet at Costa Coffee",
  },
  {
    id: "r2",
    driverId: "d2",
    driver: mockDrivers[1],
    departureLocation: "Jbeil",
    destination: "LAU Byblos",
    departureTime: "09:00",
    departureDate: "2023-05-16",
    availableSeats: 2,
    isFemaleOnly: true,
    status: "pending",
    createdAt: "2023-05-11T11:00:00Z",
    updatedAt: "2023-05-11T11:00:00Z",
    route: "Jbeil - Blat - LAU Byblos",
  },
  {
    id: "r3",
    driverId: "d1",
    driver: mockDrivers[0],
    departureLocation: "LAU Beirut",
    destination: "Hamra",
    departureTime: "17:00",
    departureDate: "2023-05-15",
    availableSeats: 3,
    isFemaleOnly: false,
    status: "pending",
    createdAt: "2023-05-10T14:00:00Z",
    updatedAt: "2023-05-10T14:00:00Z",
    route: "LAU Beirut - Ain el Mreisseh - Hamra",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    rideId: "r1",
    ride: mockRides[0],
    passengerId: "p1",
    passenger: mockPassengers[0],
    status: "pending",
    createdAt: "2023-05-12T10:00:00Z",
    updatedAt: "2023-05-12T10:00:00Z",
    punchedIn: false,
    punchedOut: false,
  },
  {
    id: "b2",
    rideId: "r2",
    ride: mockRides[1],
    passengerId: "p2",
    passenger: mockPassengers[1],
    status: "approved",
    createdAt: "2023-05-13T11:00:00Z",
    updatedAt: "2023-05-13T12:00:00Z",
    punchedIn: false,
    punchedOut: false,
    qrCode: "https://example.com/qr/b2",
  },
];

export const mockRatings: Rating[] = [
  {
    id: "ra1",
    rideId: "r1",
    fromUserId: "p1",
    toUserId: "d1",
    rating: 4,
    feedback: "Good ride, driver was punctual",
    createdAt: "2023-05-15T17:30:00Z",
  },
];

export const mockReports: Report[] = [
  {
    id: "rep1",
    fromUserId: "p2",
    againstUserId: "d1",
    reason: "Unsafe driving",
    details: "The driver was speeding and using phone while driving",
    status: "pending",
    createdAt: "2023-05-15T18:00:00Z",
  },
];

export const getCurrentUser = () => {
  // In a real application, this would come from authentication
  // For demo purposes, we'll return a mock user
  return mockPassengers[0];
};
