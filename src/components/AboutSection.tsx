import { useState } from "react";
import { Button } from "@/components/ui/button";

const tabs = {
  mission: {
    title: "Our Mission",
    content: "To provide exceptional healthcare services with compassion and excellence, ensuring the well-being of our community."
  },
  vision: {
    title: "Our Vision",
    content: "To be the leading healthcare provider, recognized for innovative medical solutions and outstanding patient care."
  },
  values: {
    title: "Core Values",
    content: "Excellence, Compassion, Integrity, Innovation, Teamwork, and Patient-Centered Care."
  }
};

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState<"mission" | "vision" | "values">("mission");

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
        
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-lg text-gray-600 text-center">
            We are committed to providing high-quality healthcare services to our community.
            With state-of-the-art facilities and experienced medical professionals,
            we ensure the best possible care for our patients.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center space-x-4 mb-8">
            {(Object.keys(tabs) as Array<keyof typeof tabs>).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
              >
                {tabs[tab].title}
              </Button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4">{tabs[activeTab].title}</h3>
            <p className="text-gray-600">{tabs[activeTab].content}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;