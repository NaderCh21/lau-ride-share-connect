
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import Layout from "@/components/layout/Layout";
import SOSButton from "@/components/common/SOSButton";
import { Star, Shield, UserCog } from "lucide-react";

// Create schema for base form fields (shared between driver and passenger)
const baseFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  campus: z.enum(["Beirut", "Byblos"]),
  residencyLocation: z.string().min(2, "Location must be at least 2 characters"),
  contactNumber: z.string().min(8, "Please enter a valid phone number"),
});

// Create schema for driver-specific fields
const driverFormSchema = baseFormSchema.extend({
  vehicleMake: z.string().min(2, "Vehicle make must be at least 2 characters"),
  vehicleModel: z.string().min(2, "Vehicle model must be at least 2 characters"),
  vehicleYear: z.string().min(4, "Please enter a valid year"),
  vehicleColor: z.string().min(2, "Vehicle color must be at least 2 characters"),
  vehiclePlateNumber: z.string().min(2, "Plate number must be at least 2 characters"),
});

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile, userRole } = useAuth();
  const { toast } = useToast();

  // Determine which schema to use based on user role
  const formSchema = userRole === "driver" ? driverFormSchema : baseFormSchema;
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      campus: (user?.campus as "Beirut" | "Byblos") || "Beirut",
      residencyLocation: user?.residencyLocation || "",
      contactNumber: user?.contactNumber || "",
      ...(userRole === "driver" && {
        vehicleMake: (user as any)?.vehicleInfo?.make || "",
        vehicleModel: (user as any)?.vehicleInfo?.model || "",
        vehicleYear: (user as any)?.vehicleInfo?.year || "",
        vehicleColor: (user as any)?.vehicleInfo?.color || "",
        vehiclePlateNumber: (user as any)?.vehicleInfo?.plateNumber || "",
      }),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      // Prepare data based on user role
      const baseUserData = {
        fullName: values.fullName,
        campus: values.campus,
        residencyLocation: values.residencyLocation,
        contactNumber: values.contactNumber,
      };
      
      // Add vehicle info only for drivers
      const userData = userRole === "driver" 
        ? {
            ...baseUserData,
            vehicleInfo: {
              make: (values as any).vehicleMake,
              model: (values as any).vehicleModel,
              year: (values as any).vehicleYear,
              color: (values as any).vehicleColor,
              plateNumber: (values as any).vehiclePlateNumber,
            },
          }
        : baseUserData;

      await updateProfile(userData);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 lg:w-1/4">
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user?.profileImage} />
                      <AvatarFallback>{user?.fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl text-center">{user?.fullName}</CardTitle>
                    <CardDescription className="text-center">{user?.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Badge 
                        variant={userRole === "driver" ? "driver" : "passenger"}
                        className="w-full text-center py-1"
                      >
                        {userRole === "driver" ? "Driver" : "Passenger"}
                      </Badge>
                    </div>
                    
                    {userRole === "driver" && (
                      <div className="flex items-center justify-center">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <Star className="w-4 h-4 text-gray-300 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">4.0</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2 text-sm">Account Details</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-500">Campus:</span>
                          <span>{user?.campus}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Location:</span>
                          <span>{user?.residencyLocation}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Gender:</span>
                          <span className="capitalize">{user?.gender}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className="capitalize">{user?.status}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-2/3 lg:w-3/4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile" className="flex items-center">
                    <UserCog className="w-4 h-4 mr-2" />
                    Edit Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="ratings" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Ratings & Feedback
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Edit Profile</CardTitle>
                      <CardDescription>
                        Update your personal information and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="campus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Campus</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select campus" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Beirut">Beirut</SelectItem>
                                      <SelectItem value="Byblos">Byblos</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="residencyLocation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Residency Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., Hamra, Achrafieh" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="contactNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Contact Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+961 XX XXX XXX" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {userRole === "driver" && (
                            <div className="border-t pt-6 mt-6">
                              <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Use TypeScript casting to handle driver-specific fields */}
                                <FormField
                                  control={form.control}
                                  name={"vehicleMake" as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Vehicle Make</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Toyota, Honda" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={"vehicleModel" as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Vehicle Model</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., Corolla, Civic" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={"vehicleYear" as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Vehicle Year</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., 2020" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={"vehicleColor" as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Vehicle Color</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., White, Black" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={"vehiclePlateNumber" as any}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>License Plate Number</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g., B 123456" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          )}

                          <Button
                            type="submit"
                            className="w-full bg-lau-green hover:bg-lau-dark"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Updating...
                              </>
                            ) : (
                              "Update Profile"
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your password and account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-2">Change Password</h4>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="current-password" className="block text-sm font-medium mb-1">
                                Current Password
                              </label>
                              <Input
                                id="current-password"
                                type="password"
                                placeholder="••••••••"
                              />
                            </div>
                            <div>
                              <label htmlFor="new-password" className="block text-sm font-medium mb-1">
                                New Password
                              </label>
                              <Input
                                id="new-password"
                                type="password"
                                placeholder="••••••••"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                                Confirm New Password
                              </label>
                              <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                              />
                            </div>
                            <Button className="w-full bg-lau-green hover:bg-lau-dark">
                              Change Password
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Add an extra layer of security to your account by enabling two-factor authentication.
                          </p>
                          <Button variant="outline">
                            Enable Two-Factor Authentication
                          </Button>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ratings">
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Your Ratings & Feedback</CardTitle>
                      <CardDescription>
                        View ratings and feedback from your rides
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userRole === "driver" ? (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-4">Overall Rating</h4>
                            <div className="flex items-center mb-2">
                              <div className="flex mr-2">
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                <Star className="w-6 h-6 text-gray-300 fill-current" />
                              </div>
                              <span className="text-2xl font-bold">4.0</span>
                              <span className="text-gray-500 ml-2">(12 ratings)</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className="text-sm w-16">5 stars</span>
                                <div className="flex-grow bg-gray-200 h-2 mx-2 rounded-full overflow-hidden">
                                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-sm w-8">60%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm w-16">4 stars</span>
                                <div className="flex-grow bg-gray-200 h-2 mx-2 rounded-full overflow-hidden">
                                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: '20%' }}></div>
                                </div>
                                <span className="text-sm w-8">20%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm w-16">3 stars</span>
                                <div className="flex-grow bg-gray-200 h-2 mx-2 rounded-full overflow-hidden">
                                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: '10%' }}></div>
                                </div>
                                <span className="text-sm w-8">10%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm w-16">2 stars</span>
                                <div className="flex-grow bg-gray-200 h-2 mx-2 rounded-full overflow-hidden">
                                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: '5%' }}></div>
                                </div>
                                <span className="text-sm w-8">5%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm w-16">1 star</span>
                                <div className="flex-grow bg-gray-200 h-2 mx-2 rounded-full overflow-hidden">
                                  <div className="bg-yellow-400 h-full rounded-full" style={{ width: '5%' }}></div>
                                </div>
                                <span className="text-sm w-8">5%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-6">
                            <h4 className="font-medium mb-4">Recent Feedback</h4>
                            <div className="space-y-4">
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>ZN</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">Ziad N.</span>
                                  </div>
                                  <div className="flex">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Great driver, very punctual and the car was clean. Would ride again!
                                </p>
                                <p className="text-xs text-gray-400 mt-2">May 15, 2023</p>
                              </div>
                              
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>NK</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">Nour K.</span>
                                  </div>
                                  <div className="flex">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-gray-300 fill-current" />
                                    <Star className="w-4 h-4 text-gray-300 fill-current" />
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Driver was ok but was a bit late. Otherwise a good ride.
                                </p>
                                <p className="text-xs text-gray-400 mt-2">May 10, 2023</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-4">Your Ratings of Drivers</h4>
                            <div className="space-y-4">
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>AK</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">Ahmad K.</span>
                                  </div>
                                  <div className="flex">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-gray-300 fill-current" />
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Good ride, driver was punctual and friendly.
                                </p>
                                <p className="text-xs text-gray-400 mt-2">May 15, 2023</p>
                              </div>
                              
                              <div className="border rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>SH</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">Sara H.</span>
                                  </div>
                                  <div className="flex">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Excellent ride! Car was clean, driver was very professional.
                                </p>
                                <p className="text-xs text-gray-400 mt-2">April 30, 2023</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <SOSButton />
      </div>
    </Layout>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  let colorClasses = "bg-gray-100 text-gray-800";
  
  if (variant === "driver") {
    colorClasses = "bg-blue-100 text-blue-800";
  } else if (variant === "passenger") {
    colorClasses = "bg-green-100 text-green-800";
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses} ${className || ""}`}>
      {children}
    </span>
  );
}
