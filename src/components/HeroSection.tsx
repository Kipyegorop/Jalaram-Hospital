
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const slides = [
  {
    image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
    title: "Welcome to Jalaram Diagnostic Center",
    description: "Providing Quality Healthcare Services",
    primaryButton: "Book Appointment",
    primaryButtonLink: "/AppointmentModal",
    secondaryButton: "Learn More",
    secondaryButtonLink: "/about-us"
  },
  {
    image: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg",
    title: "Your Checkups aren't just for you",
    description: "Theyre good for the whole team. We make it easy for you to stay on the ball with all your health needds. Don't just do it fo you. Do it for the team.",
    primaryButton: "Our Services",
    primaryButtonLink: "/services",
    secondaryButton: "Contact Us",
    secondaryButtonLink: "/contact-us"
  },
  {
    image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
    title: "Your screenings arent just for you",
    description: "Theyre good for the whole crew. We make it easy to manage all your health needs. Because when youre well, everyone stays in perfect harmony.",
    primaryButton: "Emergency Contact",
    primaryButtonLink: "/emergency-contact",
    secondyButton: "Learn More",
    secondaryButtonLink: "/learn-more"
  }
];

const HeroSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative">
      <Carousel 
        className="w-full"
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[calc(100vh-4rem)]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#221F26]/60">
                  <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                      <p className="text-lg md:text-xl mb-8">{slide.description}</p>
                      <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
                        <Button size="lg" className="w-full sm:w-auto bg-[#622426] hover:bg-[#622426]/90">
                          {slide.primaryButton}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#622426]">
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
        <div className="hidden md:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
};

export default HeroSection;
