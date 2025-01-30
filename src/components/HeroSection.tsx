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
    image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
    title: "Welcome to Our Hospital",
    description: "Providing Quality Healthcare Services",
    primaryButton: "Book Appointment",
    secondaryButton: "Learn More"
  },
  {
    image: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg",
    title: "Expert Medical Care",
    description: "Advanced Technology & Experienced Professionals",
    primaryButton: "Our Services",
    secondaryButton: "Contact Us"
  },
  {
    image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
    title: "24/7 Emergency Care",
    description: "Always Ready to Help You",
    primaryButton: "Emergency Contact",
    secondaryButton: "Learn More"
  }
];

const HeroSection = () => {
  return (
    <section className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[calc(100vh-4rem)]">
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