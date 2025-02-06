
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, KeyRound } from "lucide-react";

// Department-specific avatar mappings
const getDepartmentAvatar = (department: string) => {
  switch (department?.toLowerCase()) {
    case 'general medicine':
      return 'https://api.dicebear.com/7.x/personas/svg?seed=general&backgroundColor=b6e3f4';
    case 'pediatrics':
      return 'https://api.dicebear.com/7.x/personas/svg?seed=pediatrics&backgroundColor=ffdfba';
    case 'orthopedics':
      return 'https://api.dicebear.com/7.x/personas/svg?seed=ortho&backgroundColor=d4a373';
    case 'cardiology':
      return 'https://api.dicebear.com/7.x/personas/svg?seed=cardio&backgroundColor=ff9b85';
    case 'dermatology':
      return 'https://api.dicebear.com/7.x/personas/svg?seed=derma&backgroundColor=ddbea9';
    case 'neurology':
      return 'https://api.dicebear.com/7.x/personas/svg?seed=neuro&backgroundColor=98c1d9';
    default:
      return 'https://api.dicebear.com/7.x/personas/svg?seed=default&backgroundColor=b7b7a4';
  }
};

export const DoctorProfileMenu = ({ doctorData }: { doctorData: any }) => {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setShowPasswordDialog(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={getDepartmentAvatar(doctorData.department)}
                alt={doctorData.name}
              />
              <AvatarFallback>{doctorData.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Change Password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Information</DialogTitle>
            <DialogDescription>Your professional details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <div className="p-2 bg-gray-100 rounded">{doctorData.name}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="p-2 bg-gray-100 rounded">{doctorData.email}</div>
            </div>
            <div>
              <Label>Department</Label>
              <div className="p-2 bg-gray-100 rounded">{doctorData.department}</div>
            </div>
            <div>
              <Label>Specialization</Label>
              <div className="p-2 bg-gray-100 rounded">{doctorData.specialization || 'Not specified'}</div>
            </div>
            <div>
              <Label>Experience</Label>
              <div className="p-2 bg-gray-100 rounded">{doctorData.experience || 'Not specified'}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your new password below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>New Password</Label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <Button onClick={handlePasswordReset} className="w-full">
              Update Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
