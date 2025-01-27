import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-white mt-20 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">123 Hospital Street</p>
              <p className="mb-2">Medical District</p>
              <p className="mb-2">Nairobi, Kenya</p>
              <p className="mb-2">Phone: (254) 123-4567</p>
              <p>Email: info@hospital.com</p>
            </address>
          </div>

          {/* Visiting Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Patient Visiting Hours</h3>
            <div className="space-y-2">
              <p><span className="font-medium">General Wards:</span> 10:00 AM - 8:00 PM</p>
              <p><span className="font-medium">ICU/HDU:</span> 12:00 PM - 2:00 PM & 4:00 PM - 6:00 PM</p>
              <p><span className="font-medium">Maternity:</span> 10:00 AM - 8:00 PM</p>
              <p><span className="font-medium">Pediatric Ward:</span> 10:00 AM - 8:00 PM</p>
              <p className="text-sm text-muted-foreground mt-4">
                *Special arrangements can be made for critical cases
              </p>
            </div>
          </div>

          {/* Map Section - Placeholder */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="w-full h-[300px] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Google Maps placeholder - Add your map iframe here</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Hospital Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;