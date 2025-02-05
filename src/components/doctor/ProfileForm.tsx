
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileFormProps {
  showProfileForm: boolean;
  setShowProfileForm: (show: boolean) => void;
}

export const ProfileForm = ({ showProfileForm, setShowProfileForm }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [medicalLicense, setMedicalLicense] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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
  );
};
