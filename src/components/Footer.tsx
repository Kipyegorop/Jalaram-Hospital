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
              <p className="mb-2">Jalaram Diagnostics Center</p>
              <p className="mb-2">Nakuru, Kenya</p>
              <p className="mb-2">Phone: +254795553008</p>
              <p>Email: brianrop36@gmail.com</p>
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

          {/* Map Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="w-full h-[300px] overflow-hidden rounded-lg shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d556.1469124426483!2d36.10532634796107!3d-0.2851954882875866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1829932ca9ba401f%3A0xe28bff3b81c93921!2sJalaram%20Diagnostics%20Center%20Nakuru!5e0!3m2!1sen!2ske!4v1737967530455!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hospital Location"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jalaram Diagnostics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;