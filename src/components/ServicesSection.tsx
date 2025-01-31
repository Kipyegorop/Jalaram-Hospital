import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Baby, 
  Bone, 
  Hospital 
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Comprehensive medical care for all ages, including routine check-ups, preventive care, and treatment of common illnesses. Our experienced physicians provide personalized attention to ensure your overall well-being.",
    features: ["Regular Check-ups", "Preventive Care", "Chronic Disease Management"]
  },
  {
    icon: Heart,
    title: "Cardiology",
    description: "State-of-the-art cardiac care featuring advanced diagnostics and treatment for heart conditions. Our cardiology team specializes in both preventive care and management of complex cardiac issues.",
    features: ["ECG/EKG Services", "Heart Disease Treatment", "Cardiac Rehabilitation"]
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Expert diagnosis and treatment of neurological disorders using cutting-edge technology. Our neurologists provide comprehensive care for conditions affecting the brain, spine, and nervous system.",
    features: ["Brain Disorder Treatment", "Spine Care", "Neurological Testing"]
  },
  {
    icon: Baby,
    title: "Pediatrics",
    description: "Specialized healthcare for children from newborns to adolescents. Our pediatric team provides comprehensive care including regular check-ups, vaccinations, and treatment of childhood illnesses.",
    features: ["Child Development", "Vaccinations", "Pediatric Consultations"]
  },
  {
    icon: Bone,
    title: "Orthopedics",
    description: "Advanced treatment for bone, joint, and muscle conditions. Our orthopedic specialists offer both surgical and non-surgical solutions for musculoskeletal problems.",
    features: ["Joint Replacement", "Sports Medicine", "Fracture Care"]
  },
  {
    icon: Hospital,
    title: "Emergency Care",
    description: "24/7 emergency medical services with rapid response times. Our emergency department is fully equipped to handle all types of medical emergencies with a team of experienced emergency physicians.",
    features: ["24/7 Availability", "Trauma Care", "Critical Care Services"]
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          We provide comprehensive healthcare services with state-of-the-art facilities
          and experienced medical professionals dedicated to your well-being.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;