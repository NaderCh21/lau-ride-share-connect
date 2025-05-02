
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { mockRides } from "@/data/mockData";
import { Ride } from "@/types";
import RideCard from "@/components/rides/RideCard";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { FilterIcon, Car, ArrowRight, Search } from "lucide-react";
import SOSButton from "@/components/common/SOSButton";

export default function RidesListPage() {
  const { isAuthenticated, userRole, user } = useAuth();
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [filteredRides, setFilteredRides] = useState<Ride[]>(mockRides);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [femaleOnlyFilter, setFemaleOnlyFilter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Effect to filter rides based on search and filters
  useEffect(() => {
    let filtered = [...rides];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ride) =>
          ride.departureLocation.toLowerCase().includes(query) ||
          ride.destination.toLowerCase().includes(query) ||
          ride.route.toLowerCase().includes(query)
      );
    }

    // Tab filter
    if (activeTab === "upcoming") {
      filtered = filtered.filter((ride) => {
        const rideDate = new Date(`${ride.departureDate}T${ride.departureTime}`);
        return rideDate > new Date();
      });
    } else if (activeTab === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((ride) => ride.departureDate === today);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter((ride) => ride.departureDate === dateFilter);
    }

    // Campus filter
    if (campusFilter !== "all") {
      filtered = filtered.filter(
        (ride) =>
          ride.destination.includes(campusFilter) ||
          ride.departureLocation.includes(campusFilter)
      );
    }

    // Female only filter
    if (femaleOnlyFilter) {
      filtered = filtered.filter((ride) => ride.isFemaleOnly);
    }

    setFilteredRides(filtered);
  }, [rides, searchQuery, activeTab, dateFilter, campusFilter, femaleOnlyFilter]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setDateFilter("");
    setCampusFilter("all");
    setFemaleOnlyFilter(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Find a Ride</h1>
            
            {userRole === "driver" && (
              <Button className="bg-lau-green hover:bg-lau-dark" asChild>
                <Link to="/rides/create">
                  <Car className="w-5 h-5 mr-2" /> Offer a Ride
                </Link>
              </Button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by location or route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button
                variant="outline"
                className="md:w-auto flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {showFilters && (
              <div className="mb-6 border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div>
                  <Label htmlFor="date-filter" className="block mb-2 text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full"
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="campus-filter" className="block mb-2 text-sm font-medium">
                    Campus
                  </Label>
                  <Select value={campusFilter} onValueChange={setCampusFilter}>
                    <SelectTrigger id="campus-filter">
                      <SelectValue placeholder="Select campus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campuses</SelectItem>
                      <SelectItem value="Beirut">Beirut</SelectItem>
                      <SelectItem value="Byblos">Byblos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="female-only"
                    checked={femaleOnlyFilter}
                    onCheckedChange={(checked) => 
                      setFemaleOnlyFilter(checked as boolean)
                    }
                  />
                  <Label htmlFor="female-only" className="text-sm font-medium">
                    Female only rides
                  </Label>
                </div>
                
                <div className="md:col-span-3">
                  <Button variant="link" onClick={handleResetFilters} className="text-lau-green p-0">
                    Reset all filters
                  </Button>
                </div>
              </div>
            )}

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Rides</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredRides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
              {filteredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium mb-2">No rides found</h3>
              <p className="text-gray-500 mb-6">
                There are no rides matching your search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          )}

          <div className="bg-lau-green text-white p-6 rounded-lg shadow-sm mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2">Can't find a suitable ride?</h3>
                <p>
                  Help grow our community by offering a ride to fellow students.
                </p>
              </div>
              {userRole === "driver" ? (
                <Button className="bg-white text-lau-green hover:bg-gray-100" asChild>
                  <Link to="/rides/create">
                    Offer a Ride <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button className="bg-white text-lau-green hover:bg-gray-100" asChild>
                  <Link to="/register">
                    Register as Driver <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <SOSButton />
      </div>
    </Layout>
  );
}
