
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRides } from "@/contexts/RideContext";
import { Car, MapPin, Calendar, ArrowRight, User, Shield, Clock } from "lucide-react";
import RideCard from "@/components/rides/RideCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const [animatedElements, setAnimatedElements] = useState({});

  // Update featured rides when rides change
  useEffect(() => {
    setFeaturedRides(rides.slice(0, 3));
  }, [rides]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedElements(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Hook for animations
  useEffect(() => {
    // Mark as loaded to prevent flashing
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  return <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero-section" className={`bg-gradient-to-r from-lau-green to-lau-dark py-20 md:py-28 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                Share a Ride with LAU Students
              </h1>
              <p className="text-lg md:text-xl mb-8 animate-[fade-in_0.6s_0.3s_both]">
                Connect with fellow students and share rides to and from campus safely and conveniently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-[fade-in_0.6s_0.6s_both]">
                {isAuthenticated ? <>
                    <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100 hover:scale-105 transition-all duration-300" asChild>
                      <Link to="/rides">Find a Ride</Link>
                    </Button>
                    {userRole === "driver" && <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300" asChild>
                        <Link to="/rides/create">Offer a Ride</Link>
                      </Button>}
                  </> : <>
                    <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100 hover:scale-105 transition-all duration-300" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                  </>}
              </div>
            </div>
            <div className="md:w-1/3 mt-12 md:mt-0 animate-[scale-in_0.6s_0.6s_both]">
              <img 
                src="/placeholder.png" 
                alt="Students sharing rides" 
                className="w-full rounded-lg shadow-xl transform rotate-2 hover:rotate-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 relative animate-on-scroll" id="how-title">
            <span className={`inline-block transition-all duration-700 ${animatedElements['how-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              How It Works
            </span>
            <span className="block h-1 w-20 bg-lau-green mx-auto mt-4"></span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto animate-on-scroll" id="how-desc">
            <span className={`inline-block transition-all duration-700 delay-100 ${animatedElements['how-desc'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Getting started with LAU Ride Share is simple and straightforward. Follow these steps:
            </span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className={`flex flex-col items-center text-center hover-scale animate-on-scroll ${animatedElements['step-1'] ? 'animate-fade-in' : 'opacity-0'}`} id="step-1">
              <div className="bg-lau-light p-5 rounded-full mb-6 shadow-md">
                <User className="w-10 h-10 text-lau-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
              <p className="text-gray-600">
                Sign up as a driver or passenger using your LAU email and verify your identity.
              </p>
            </div>
            
            <div className={`flex flex-col items-center text-center hover-scale animate-on-scroll ${animatedElements['step-2'] ? 'animate-fade-in' : 'opacity-0'}`} id="step-2">
              <div className="bg-lau-light p-5 rounded-full mb-6 shadow-md">
                <Car className="w-10 h-10 text-lau-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find or Offer Rides</h3>
              <p className="text-gray-600">
                Search for available rides or offer your own to help fellow students commute.
              </p>
            </div>
            
            <div className={`flex flex-col items-center text-center hover-scale animate-on-scroll ${animatedElements['step-3'] ? 'animate-fade-in' : 'opacity-0'}`} id="step-3">
              <div className="bg-lau-light p-5 rounded-full mb-6 shadow-md">
                <Clock className="w-10 h-10 text-lau-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Schedule Trips</h3>
              <p className="text-gray-600">
                Set your schedule and find rides that match your university timetable.
              </p>
            </div>
            
            <div className={`flex flex-col items-center text-center hover-scale animate-on-scroll ${animatedElements['step-4'] ? 'animate-fade-in' : 'opacity-0'}`} id="step-4">
              <div className="bg-lau-light p-5 rounded-full mb-6 shadow-md">
                <MapPin className="w-10 h-10 text-lau-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Travel Together</h3>
              <p className="text-gray-600">
                Connect safely via QR verification, save money, reduce traffic, and make new friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rides */}
      <section id="featured-section" className={`py-20 bg-gray-50 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold relative">
              Featured Rides
              <span className="block h-1 w-16 bg-lau-green mt-3"></span>
            </h2>
            <Button variant="ghost" asChild className="group">
              <Link to="/rides" className="flex items-center hover:text-lau-green transition-colors">
                View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {featuredRides.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {featuredRides.map((ride, index) => (
                  <CarouselItem key={ride.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="p-1">
                      <RideCard key={ride.id} ride={ride} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8">
                <CarouselPrevious className="relative static mx-2" />
                <CarouselNext className="relative static mx-2" />
              </div>
            </Carousel>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p>Loading rides...</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 animate-on-scroll" id="benefits-title">
            <span className={`inline-block transition-all duration-700 ${animatedElements['benefits-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Why Share a Ride?
            </span>
            <span className="block h-1 w-20 bg-lau-green mx-auto mt-4"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className={`bg-gradient-to-br from-lau-light to-white rounded-lg p-8 shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-on-scroll ${animatedElements['benefit-1'] ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`} id="benefit-1">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-lau-green text-white p-2 rounded-full mr-3 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </span>
                Save Money
              </h3>
              <p className="text-gray-600">
                Split fuel and parking costs with fellow students, making commuting more affordable for everyone.
              </p>
            </div>
            
            <div className={`bg-gradient-to-br from-lau-light to-white rounded-lg p-8 shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-on-scroll delay-100 ${animatedElements['benefit-2'] ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'}`} id="benefit-2">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-lau-green text-white p-2 rounded-full mr-3 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </span>
                Reduce Stress
              </h3>
              <p className="text-gray-600">
                Avoid the hassle of finding parking and navigating traffic alone. Share the driving responsibility.
              </p>
            </div>
            
            <div className={`bg-gradient-to-br from-lau-light to-white rounded-lg p-8 shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-on-scroll delay-200 ${animatedElements['benefit-3'] ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`} id="benefit-3">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-lau-green text-white p-2 rounded-full mr-3 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </span>
                Environmental Impact
              </h3>
              <p className="text-gray-600">
                Reduce carbon emissions by sharing rides and contributing to a greener campus environment.
              </p>
            </div>
            
            <div className={`bg-gradient-to-br from-lau-light to-white rounded-lg p-8 shadow-lg transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl animate-on-scroll delay-300 ${animatedElements['benefit-4'] ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'}`} id="benefit-4">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-lau-green text-white p-2 rounded-full mr-3 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </span>
                Community Building
              </h3>
              <p className="text-gray-600">
                Connect with fellow LAU students, build relationships, and strengthen our university community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-lau-green text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.png')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 animate-on-scroll" id="cta-title">
            <span className={`inline-block transition-all duration-700 ${animatedElements['cta-title'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Ready to Share a Ride?
            </span>
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-on-scroll" id="cta-desc">
            <span className={`inline-block transition-all duration-700 delay-100 ${animatedElements['cta-desc'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Join our community of LAU students sharing rides to make commuting easier, cheaper, and more sustainable.
            </span>
          </p>
          
          <div className="animate-on-scroll" id="cta-button">
            <div className={`transition-all duration-700 delay-200 ${animatedElements['cta-button'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {isAuthenticated ? 
                <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg" asChild>
                  <Link to="/rides">Find Available Rides</Link>
                </Button> 
                : 
                <Button size="lg" className="bg-white text-lau-green hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg" asChild>
                  <Link to="/register">Sign Up Now</Link>
                </Button>
              }
            </div>
          </div>
        </div>
      </section>
    </div>;
}
