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
import AppointmentModal from "./AppointmentModal";

const slides = [
  {
    image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
    title: "Welcome to Jalaram Diagnostic Center",
    description: "Providing Quality Healthcare Services",
    primaryButton: "Book Appointment",
    primaryButtonAction: "appointment",
    secondaryButton: "Learn More",
    secondaryButtonLink: "/about-us"
  },
  {
    image: "https://images.pexels.com/photos/3259624/pexels-photo-3259624.jpeg",
    title: "Your Checkups aren't just for you",
    description: "They're good for the whole team. We make it easy for you to stay on the ball with all your health needs. Don't just do it for you. Do it for the team.",
    primaryButton: "Our Services",
    primaryButtonLink: "/services",
    secondaryButton: "Contact Us",
    secondaryButtonAction: "whatsapp"
  },
  {
    image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
    title: "Your screenings aren't just for you",
    description: "They're good for the whole crew. We make it easy to manage all your health needs. Because when you're well, everyone stays in perfect harmony.",
    primaryButton: "Emergency Contact",
    primaryButtonAction: "emergency",
    secondaryButton: "Learn More",
    secondaryButtonLink: "/learn-more"
  }
];

const HeroSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const handleButtonClick = (action: string | undefined, link: string | undefined) => {
    if (action === "whatsapp") {
      window.open("https://wa.me/254795553008", "_blank");
    } else if (action === "emergency") {
      window.open("https://wa.me/254795553008?text=Emergency:%20I%20need%20immediate%20medical%20assistance", "_blank");
    } else if (action === "appointment") {
      // The AppointmentModal handles its own visibility
      return;
    } else if (link) {
      window.location.href = link;
    }
  };

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
                        {slide.primaryButtonAction === "appointment" ? (
                          <AppointmentModal />
                        ) : (
                          <Button 
                            size="lg" 
                            className="w-full sm:w-auto bg-[#622426] hover:bg-[#622426]/90"
                            onClick={() => handleButtonClick(slide.primaryButtonAction, slide.primaryButtonLink)}
                          >
                            {slide.primaryButton}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full sm:w-auto border-white text-[#622426] hover:bg-white hover:text-[#622426] bg-white"
                          onClick={() => handleButtonClick(slide.secondaryButtonAction, slide.secondaryButtonLink)}
                        >
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