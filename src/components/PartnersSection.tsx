const partners = [
  {
    name: "KCB Insurance",
    logo: "/placeholder.svg"
  },
  {
    name: "Madison Insurance",
    logo: "/placeholder.svg"
  },
  {
    name: "Jubilee Insurance",
    logo: "/placeholder.svg"
  },
  {
    name: "AAR Insurance",
    logo: "/placeholder.svg"
  },
  {
    name: "NHIF",
    logo: "/placeholder.svg"
  },
  {
    name: "Britam Insurance",
    logo: "/placeholder.svg"
  }
];

const PartnersSection = () => {
  return (
    <section id="partners" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Partners</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-16 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;