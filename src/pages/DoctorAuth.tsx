import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, Mail, Lock, Home } from "lucide-react";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Verify doctor's department before redirecting
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('department')
          .eq('email', session.user.email)
          .single();

        if (error || !doctorData) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are not authorized as a doctor.",
          });
          return;
        }

        navigate('/doctor-dashboard');
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Verify doctor's department before redirecting
        const { data: doctorData, error } = await supabase
          .from('doctors')
          .select('department')
          .eq('email', session.user.email)
          .single();

        if (error || !doctorData) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Error",
            description: "You are not authorized as a doctor.",
          });
          return;
        }

        navigate('/doctor-dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // First verify if the doctor exists in the selected department
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('email', email)
        .eq('department', department)
        .single();

      if (doctorError || !doctorData) {
        throw new Error('You are not authorized for this department.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/doctor-dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
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

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
          <CardDescription>
            Sign in to access your appointments and manage your schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              <Lock className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAuth;