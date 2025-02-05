
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please enter your name.",
      });
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        variant: "destructive",
        title: "Message Required",
        description: "Please enter your message.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          variant: "destructive",
          title: "Message Not Sent",
          description: data.details || "Please try again later or contact us directly.",
        });
        return;
      }

      toast({
        title: "Message Received!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Clear form after successful submission
      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast({
        variant: "destructive",
        title: "Failed to Send Message",
        description: error.details || "Please try again later or contact us directly at brianrop36@gmail.com",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+254795553008",
      extra: (
        <a 
          href="https://wa.me/254795553008" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 transition-colors"
        >
          WhatsApp Us
        </a>
      )
    },
    {
      icon: Mail,
      title: "Email",
      content: "brianrop36@gmail.com"
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Jalaram Diagnostics Center, Nakuru, Kenya"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-[#221F26]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Contact Us</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <item.icon className="w-6 h-6 text-white mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.content}</p>
                  {item.extra}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              placeholder="Your Name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Your Email"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Textarea
              placeholder="Your Message"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[150px]"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
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
