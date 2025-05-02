import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { Car, MapPin, Calendar, ArrowRight } from "lucide-react";
import RideCard from "@/components/rides/RideCard";
export default function HomePage() {
  const {
    isAuthenticated,
    userRole
  } = useAuth();
  const {
    rides
  } = useRides();
  const [featuredRides, setFeaturedRides] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update featured rides when rides change
  useEffect(() => {
    setFeaturedRides(rides.slice(0, 3));
  }, [rides]);

  // Hook for animations
  useEffect(() => {
    // Mark as loaded to prevent flashing
    setIsLoaded(true);
  }, []);
  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero-section" className={`bg-gradient-to-r from-lau-green to-lau-dark py-16 md:py-24 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Share a Ride with LAU Students
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Connect with fellow students and share rides to and from campus safely and conveniently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? <>
                    <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100" asChild>
                      <Link to="/rides">Find a Ride</Link>
                    </Button>
                    {userRole === "driver" && <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                        <Link to="/rides/create">Offer a Ride</Link>
                      </Button>}
                  </> : <>
                    <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                      <Link to="/login" style={{ backgroundColor: "#3355" }}>Login</Link>
                    </Button>
                  </>}
              </div>
            </div>
            <div className="md:w-1/3 mt-8 md:mt-0">
              <img src="/placeholder.png" alt="Students sharing rides" className="w-full rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center hover-scale">
              <div className="bg-lau-light p-4 rounded-full mb-4">
                {/* <User className="w-10 h-10 text-lau-green" /> */}
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up as a driver or passenger using your LAU email and verify your identity.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center hover-scale">
              <div className="bg-lau-light p-4 rounded-full mb-4">
                <Car className="w-10 h-10 text-lau-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find or Offer Rides</h3>
              <p className="text-gray-600">
                Search for available rides or offer your own to help fellow students commute.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center hover-scale">
              <div className="bg-lau-light p-4 rounded-full mb-4">
                <MapPin className="w-10 h-10 text-lau-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Travel Together</h3>
              <p className="text-gray-600">
                Connect safely via QR verification, save money, reduce traffic, and make new friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rides */}
      <section id="featured-section" className={`py-16 bg-gray-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Rides</h2>
            <Button variant="ghost" asChild>
              <Link to="/rides" className="flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRides.map(ride => <RideCard key={ride.id} ride={ride} />)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Share a Ride?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-lau-light rounded-lg p-6 hover-scale">
              <h3 className="text-xl font-semibold mb-3">Save Money</h3>
              <p className="text-gray-600">
                Split fuel and parking costs with fellow students, making commuting more affordable for everyone.
              </p>
            </div>
            
            <div className="bg-lau-light rounded-lg p-6 hover-scale">
              <h3 className="text-xl font-semibold mb-3">Reduce Stress</h3>
              <p className="text-gray-600">
                Avoid the hassle of finding parking and navigating traffic alone. Share the driving responsibility.
              </p>
            </div>
            
            <div className="bg-lau-light rounded-lg p-6 hover-scale">
              <h3 className="text-xl font-semibold mb-3">Environmental Impact</h3>
              <p className="text-gray-600">
                Reduce carbon emissions by sharing rides and contributing to a greener campus environment.
              </p>
            </div>
            
            <div className="bg-lau-light rounded-lg p-6 hover-scale">
              <h3 className="text-xl font-semibold mb-3">Community Building</h3>
              <p className="text-gray-600">
                Connect with fellow LAU students, build relationships, and strengthen our university community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-lau-green text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Share a Ride?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of LAU students sharing rides to make commuting easier, cheaper, and more sustainable.
          </p>
          
          {isAuthenticated ? <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100" asChild>
              <Link to="/rides">Find Available Rides</Link>
            </Button> : <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100" asChild>
              <Link to="/register">Sign Up Now</Link>
            </Button>}
        </div>
      </section>
    </div>;
}
// function User(props: any) {
//   return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//       <circle cx="12" cy="7" r="4" />
//     </svg>;
// }