import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AppointmentModal from "./AppointmentModal";
import { LogIn, Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-white hover:text-primary">About</a>
            <a href="#services" className="text-white hover:text-primary">Services</a>
            <a href="#faq" className="text-white hover:text-primary">FAQ</a>
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a
              href="#about"
              className="block text-white hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#services"
              className="block text-white hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#faq"
              className="block text-white hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#partners"
              className="block text-white hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Partners
            </a>
            <div className="pt-2">
              <AppointmentModal />
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate("/doctor-auth")}
              className="w-full flex items-center justify-center gap-2 text-white border-white hover:bg-white hover:text-[#221F26]"
            >
              <LogIn className="w-4 h-4" />
              Doctor Login
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;