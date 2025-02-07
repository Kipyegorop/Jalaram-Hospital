interface HeroSlideProps {
  image: string;
  children: React.ReactNode;
}

const HeroSlide = ({ image, children }: HeroSlideProps) => {
  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <img
        src={image}
        alt="Hero slide"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#221F26]/60">
        <div className="container mx-auto px-4 h-full flex items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeroSlide;