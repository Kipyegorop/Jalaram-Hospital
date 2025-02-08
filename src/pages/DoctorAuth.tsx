
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { SignInForm } from "@/components/doctor/SignInForm";
import { ProfileForm } from "@/components/doctor/ProfileForm";
import { useDoctorAuth } from "@/hooks/useDoctorAuth";

const departments = [
  "General Medicine",
  "Pediatrics",
  "Orthopedics",
  "Cardiology",
  "Dermatology",
  "Neurology",
];

const DoctorAuth = () => {
  const { showProfileForm, setShowProfileForm } = useDoctorAuth();

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
              Sign in with your hospital credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm 
              setShowProfileForm={setShowProfileForm}
              departments={departments}
            />
          </CardContent>
        </Card>
      ) : (
        <ProfileForm 
          showProfileForm={showProfileForm}
          setShowProfileForm={setShowProfileForm}
        />
      )}
    </div>
  );
};

export default DoctorAuth;
