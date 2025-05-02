
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Car, User, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { isAuthenticated, logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/de2beea1-0f3a-4cca-9619-8f619db2c38c.png" 
            alt="LAU Share a Ride" 
            className="h-10"
          />
          <span className="font-bold text-lau-green text-xl hidden md:block">Share a Ride</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-lau-green transition-colors">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/rides" className="text-gray-700 hover:text-lau-green transition-colors">
                Find Rides
              </Link>
              {userRole === "driver" && (
                <Link to="/rides/create" className="text-gray-700 hover:text-lau-green transition-colors">
                  Offer Ride
                </Link>
              )}
              <Link to="/bookings" className="text-gray-700 hover:text-lau-green transition-colors">
                My Bookings
              </Link>
              <div className="flex items-center gap-4">
                <Link to="/notifications" className="text-gray-700 hover:text-lau-green transition-colors">
                  <Bell className="w-5 h-5" />
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-lau-green transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-lau-green hover:bg-lau-dark">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6">
          <Link 
            to="/" 
            className="text-xl font-medium text-gray-800 py-2 border-b"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/rides" 
                className="text-xl font-medium text-gray-800 py-2 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find Rides
              </Link>
              
              {userRole === "driver" && (
                <Link 
                  to="/rides/create" 
                  className="text-xl font-medium text-gray-800 py-2 border-b"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Offer Ride
                </Link>
              )}
              
              <Link 
                to="/bookings" 
                className="text-xl font-medium text-gray-800 py-2 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
              
              <Link 
                to="/notifications" 
                className="text-xl font-medium text-gray-800 py-2 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                Notifications
              </Link>
              
              <Link 
                to="/profile" 
                className="text-xl font-medium text-gray-800 py-2 border-b"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
              
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              <Button 
                variant="outline" 
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/login">Login</Link>
              </Button>
              
              <Button 
                className="bg-lau-green hover:bg-lau-dark" 
                asChild
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
