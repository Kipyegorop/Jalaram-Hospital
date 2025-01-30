const partners = [
  {
    name: "KCB Insurance",
    logo: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Madison Insurance",
    logo: "https://images.pexels.com/photos/534217/pexels-photo-534217.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Jubilee Insurance",
    logo: "https://images.pexels.com/photos/534218/pexels-photo-534218.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "AAR Insurance",
    logo: "https://images.pexels.com/photos/534219/pexels-photo-534219.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "NHIF",
    logo: "https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    name: "Britam Insurance",
    logo: "https://images.pexels.com/photos/534221/pexels-photo-534221.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

const PartnersSection = () => {
  return (
    <section id="partners" className="py-20 bg-[#221F26]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Partners</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center bg-white p-4 rounded-lg">
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