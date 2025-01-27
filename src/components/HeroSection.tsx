import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80",
    title: "Welcome to Our Hospital",
    description: "Providing Quality Healthcare Services",
    primaryButton: "Book Appointment",
    secondaryButton: "Learn More"
  },
  {
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80",
    title: "Expert Medical Care",
    description: "Advanced Technology & Experienced Professionals",
    primaryButton: "Our Services",
    secondaryButton: "Contact Us"
  },
  {
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80",
    title: "24/7 Emergency Care",
    description: "Always Ready to Help You",
    primaryButton: "Emergency Contact",
    secondaryButton: "Learn More"
  }
];

const HeroSection = () => {
  return (
    <section className="pt-16 min-h-screen relative">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[600px]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50">
                  <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                      <p className="text-xl mb-8">{slide.description}</p>
                      <div className="space-x-4">
                        <Button size="lg">{slide.primaryButton}</Button>
                        <Button variant="outline" size="lg">
                          {slide.secondaryButton}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default HeroSection;