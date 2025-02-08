
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SignInFormProps {
  setShowProfileForm: (show: boolean) => void;
  departments: string[];
}

export const SignInForm = ({ setShowProfileForm, departments }: SignInFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !department || !name) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      setLoading(true);

      // First create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          description: signUpError.message,
        });
        return;
      }

      if (!authData.user) {
        toast({
          variant: "destructive",
          title: "Sign Up Error",
          description: "Failed to create user account.",
        });
        return;
      }

      // Then create/update the doctor record
      const { error: doctorError } = await supabase
        .from('doctors')
        .upsert({
          id: authData.user.id,
          email,
          name,
          department,
          is_profile_complete: false
        });

      if (doctorError) {
        // If doctor creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create doctor profile. Please try again.",
        });
        return;
      }

      setShowProfileForm(true);
      
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

  const handleSignIn = async (e: React.FormEvent) => {
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

      // First authenticate the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          toast({
            variant: "destructive",
            title: "Invalid Credentials",
            description: "Please check your email and password and try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Error",
            description: authError.message,
          });
        }
        return;
      }

      // Then check if they're a doctor with the right department
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select()
        .eq('email', email)
        .eq('department', department)
        .maybeSingle();

      if (doctorError || !doctor) {
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not authorized for this department or email is not registered.",
        });
        return;
      }

      // Redirect based on profile completion
      if (!doctor.is_profile_complete) {
        setShowProfileForm(true);
      } else {
        navigate('/doctor-dashboard');
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

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <form onSubmit={handleSignIn} className="space-y-4">
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
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              "Creating account..."
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Sign up
              </>
            )}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

