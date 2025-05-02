
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";

const baseFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email) => email.endsWith("@lau.edu"), {
      message: "Please use your LAU email address",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"]),
  campus: z.enum(["Beirut", "Byblos"]),
  residencyLocation: z.string().min(2, "Location must be at least 2 characters"),
  contactNumber: z.string().min(8, "Please enter a valid phone number"),
  role: z.enum(["driver", "passenger"]),
});

const driverFormSchema = baseFormSchema.extend({
  role: z.literal("driver"),
  licenseNumber: z.string().min(6, "License number must be at least 6 characters"),
  vehicleMake: z.string().min(2, "Vehicle make must be at least 2 characters"),
  vehicleModel: z.string().min(2, "Vehicle model must be at least 2 characters"),
  vehicleYear: z.string().min(4, "Please enter a valid year"),
  vehicleColor: z.string().min(2, "Vehicle color must be at least 2 characters"),
  vehiclePlateNumber: z.string().min(2, "Plate number must be at least 2 characters"),
});

const passengerFormSchema = baseFormSchema.extend({
  role: z.literal("passenger"),
});

// Merged form schema with conditional validation
const formSchema = z.discriminatedUnion("role", [
  driverFormSchema,
  passengerFormSchema,
])
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserRole>("passenger");
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "male",
      campus: "Beirut",
      residencyLocation: "",
      contactNumber: "",
      role: "passenger",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const userData = {
        fullName: values.fullName,
        email: values.email,
        gender: values.gender,
        campus: values.campus,
        residencyLocation: values.residencyLocation,
        contactNumber: values.contactNumber,
        role: values.role,
        ...(values.role === "driver" && {
          licenseNumber: values.licenseNumber,
          vehicleInfo: {
            make: values.vehicleMake,
            model: values.vehicleModel,
            year: values.vehicleYear,
            color: values.vehicleColor,
            plateNumber: values.vehiclePlateNumber,
          },
          reportCount: 0,
        }),
      };

      await register(userData);
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email to verify your account.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setUserType(value as UserRole);
    form.setValue("role", value as UserRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <Link to="/">
            <img
              src="/lovable-uploads/de2beea1-0f3a-4cca-9619-8f619db2c38c.png"
              alt="LAU Share a Ride"
              className="mx-auto h-20"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-lau-green hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Sign up as a driver or passenger</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="passenger">Passenger</TabsTrigger>
                <TabsTrigger value="driver">Driver</TabsTrigger>
              </TabsList>
            </Tabs>

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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LAU Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.name@lau.edu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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

                {userType === "driver" && (
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Driver's License Number</FormLabel>
                            <FormControl>
                              <Input placeholder="License number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vehicleMake"
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
                        name="vehicleModel"
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
                        name="vehicleYear"
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
                        name="vehicleColor"
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
                        name="vehiclePlateNumber"
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

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={() => (
                      <FormItem>
                        <FormDescription>
                          By registering, you agree to our terms of service and privacy policy. We will send a verification email to your LAU email address.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lau-green hover:bg-lau-dark"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
