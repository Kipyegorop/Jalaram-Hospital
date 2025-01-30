import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./AppointmentModal";
import { LogIn, Heart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-[#221F26]/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-white" />
            <a href="/" className="text-2xl font-bold text-white">
              Hospital Logo
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-white hover:text-primary">About</a>
            <a href="#services" className="text-white hover:text-primary">Services</a>
            <a href="#partners" className="text-white hover:text-primary">Partners</a>
            <AppointmentModal />
            <Button 
              variant="outline"
              onClick={() => navigate("/doctor-auth")}
              className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-[#221F26]"
            >
              <LogIn className="w-4 h-4" />
              Doctor Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;