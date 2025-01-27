import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary">
              Hospital Logo
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-primary">About</a>
            <a href="#services" className="text-gray-600 hover:text-primary">Services</a>
            <a href="#partners" className="text-gray-600 hover:text-primary">Partners</a>
            <Button>Book Appointment</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;