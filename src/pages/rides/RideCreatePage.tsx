
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Car, AlertTriangle } from "lucide-react";
import SOSButton from "@/components/common/SOSButton";

const formSchema = z.object({
  departureLocation: z.string().min(2, "Departure location is required"),
  destination: z.string().min(2, "Destination is required"),
  departureDate: z.string().min(2, "Departure date is required"),
  departureTime: z.string().min(2, "Departure time is required"),
  route: z.string().min(2, "Route description is required"),
  availableSeats: z.coerce.number().min(1).max(10),
  isFemaleOnly: z.boolean().default(false),
  notes: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RideCreatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureLocation: "",
      destination: "",
      departureDate: format(new Date(), "yyyy-MM-dd"),
      departureTime: "",
      route: "",
      availableSeats: 3,
      isFemaleOnly: false,
      notes: "",
      price: 0,
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);

    // Make sure departure date and time are in the future
    const departureDateTime = new Date(`${values.departureDate}T${values.departureTime}`);
    if (departureDateTime < new Date()) {
      toast({
        title: "Invalid date or time",
        description: "Departure date and time must be in the future",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // In a real application, this would send the data to the server
    // For demo purposes, we'll simulate a successful submission
    setTimeout(() => {
      toast({
        title: "Ride created",
        description: "Your ride has been successfully created.",
      });
      setIsSubmitting(false);
      navigate("/rides");
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Car className="w-6 h-6 mr-2 text-lau-green" />
            <h1 className="text-3xl font-bold">Offer a Ride</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 animate-fade-in">
              <CardHeader>
                <CardTitle>Ride Details</CardTitle>
                <CardDescription>
                  Enter the details of the ride you want to offer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="departureLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Hamra, Achrafieh" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., LAU Beirut, LAU Byblos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                min={format(new Date(), "yyyy-MM-dd")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departureTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departure Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availableSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Seats</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} max={10} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Seat (optional)</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>Leave at 0 for free rides</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="route"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Route Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Hamra - Ain el Mreisseh - LAU Beirut"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Describe the route you'll take
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Meeting point, luggage space, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFemaleOnly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>Female Only Ride</FormLabel>
                            <FormDescription>
                              Only female passengers will be able to join this ride
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium">
                          Important Notice
                        </p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Once a ride is created, you can only cancel it at least 24 hours before the departure time.
                          Please make sure all details are correct before submitting.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-lau-green hover:bg-lau-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Creating ride...
                        </>
                      ) : (
                        "Create Ride"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-gray-500">{user?.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Vehicle</p>
                      <p className="text-sm text-gray-500">
                        {user?.role === "driver" ? 
                          `${(user as any).vehicleInfo?.color} ${(user as any).vehicleInfo?.make} ${(user as any).vehicleInfo?.model}` :
                          "No vehicle information"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Plate Number</p>
                      <p className="text-sm text-gray-500">
                        {user?.role === "driver" ? 
                          `${(user as any).vehicleInfo?.plateNumber}` :
                          "No plate information"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Ride Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <p>Be punctual and arrive at least 5 minutes before the scheduled departure time.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <p>Verify passenger identity using the QR code before starting the ride.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <p>Drive safely and adhere to all traffic rules.</p>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-lau-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                      <p>You can cancel rides at least 24 hours before departure.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <SOSButton />
      </div>
    </Layout>
  );
}
