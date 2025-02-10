import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import HeroSlide from "./hero/HeroSlide";
import SlideContent from "./hero/SlideContent";

const slides = [
  {
    image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
    title: "Welcome to Jalaram St. Christopher Diagnostic Hospital",
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
    primaryButtonLink: "./ServicesSection",
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
              <HeroSlide image={slide.image}>
                <SlideContent
                  {...slide}
                  onButtonClick={handleButtonClick}
                />
              </HeroSlide>
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