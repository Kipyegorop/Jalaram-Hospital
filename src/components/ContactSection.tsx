import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const ContactSection = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#221F26]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Contact Us</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-white mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white">Phone</h3>
                <p className="text-gray-300">+254795553008</p>
                <a 
                  href="https://wa.me/254795553008" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-white mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white">Email</h3>
                <p className="text-gray-300">brianrop36@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-white mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white">Address</h3>
                <p className="text-gray-300">Jalaram Diagnostics Center, Nakuru, Kenya</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                placeholder="Your Name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your Email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Your Message"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[150px]"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white text-[#221F26] hover:bg-white/90"
              disabled={isLoading}
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <span className="flex items-center gap-2">
                  Send Message
                  <Send className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;