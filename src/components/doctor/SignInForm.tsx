
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
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

interface SignInFormProps {
  setShowProfileForm: (show: boolean) => void;
  departments: string[];
}

export const SignInForm = ({ setShowProfileForm, departments }: SignInFormProps) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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

      const { data: doctors, error: doctorError } = await supabase
        .from('doctors')
        .select()
        .eq('email', email)
        .eq('department', department);

      if (doctorError) {
        throw doctorError;
      }

      if (!doctors || doctors.length === 0) {
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

  return (
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
  );
};
