
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, Mail, Lock, Home, User, Phone, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const departments = [
  "General Medicine",
  "Pediatrics",
  "Orthopedics",
  "Cardiology",
  "Dermatology",
  "Neurology",
];

const DoctorAuth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [medicalLicense, setMedicalLicense] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are not authorized as a doctor.",
          });
          return;
        }

        if (doctorData && !doctorData.is_profile_complete) {
          setShowProfileForm(true);
        } else if (doctorData && doctorData.is_profile_complete) {
          navigate('/doctor-dashboard');
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are not authorized as a doctor.",
          });
          return;
        }

        if (doctorData && !doctorData.is_profile_complete) {
          setShowProfileForm(true);
        } else if (doctorData && doctorData.is_profile_complete) {
          navigate('/doctor-dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !department) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setLoading(true);

      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('email', email)
        .eq('department', department)
        .maybeSingle();

      if (doctorError || !doctorData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized for this department or email is not registered.",
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
            description: "Please check your email and password and try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Error",
            description: error.message,
          });
        }
        return;
      }

      if (data.user) {
        const { data: doctor, error: updateError } = await supabase
          .from('doctors')
          .update({ id: data.user.id })
          .eq('email', email)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating doctor id:', updateError);
          return;
        }

        if (!doctor.is_profile_complete) {
          setShowProfileForm(true);
        } else {
          navigate('/doctor-dashboard');
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!name || !phoneNumber || !medicalLicense) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const { error: updateError } = await supabase
        .from('doctors')
        .update({
          name,
          phone_number: phoneNumber,
          medical_license: medicalLicense,
          is_profile_complete: true,
          id: user.id
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });

      setShowProfileForm(false);
      navigate('/doctor-dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Link 
        to="/" 
        className="absolute top-4 left-4 p-2 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <Home className="h-5 w-5" />
        Back to Home
      </Link>

      {!showProfileForm ? (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
            <CardDescription>
              Sign in to access your appointments and manage your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Select
                  value={department}
                  onValueChange={setDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !department}>
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={showProfileForm} onOpenChange={setShowProfileForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Complete Your Profile</DialogTitle>
              <DialogDescription>
                Please provide your information to complete your profile. This is required before accessing the dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Medical License Number"
                  value={medicalLicense}
                  onChange={(e) => setMedicalLicense(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              onClick={handleProfileUpdate} 
              className="w-full"
              disabled={loading || !name || !phoneNumber || !medicalLicense}
            >
              {loading ? "Updating..." : "Complete Profile"}
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DoctorAuth;
