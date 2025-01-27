import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Baby, 
  Bone, 
  FirstAid 
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Comprehensive medical care for all your health needs"
  },
  {
    icon: Heart,
    title: "Cardiology",
    description: "Expert care for heart and cardiovascular conditions"
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Specialized treatment for neurological disorders"
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Dedicated care for children's health and development"
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description: "Treatment for bone and joint conditions"
  },
  {
    icon: FirstAid,
    title: "Emergency Care",
    description: "24/7 emergency medical services"
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;