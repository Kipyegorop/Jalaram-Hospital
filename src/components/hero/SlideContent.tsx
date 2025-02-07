import { Button } from "@/components/ui/button";
import AppointmentModal from "../AppointmentModal";

interface SlideContentProps {
  title: string;
  description: string;
  primaryButton: string;
  primaryButtonAction?: string;
  primaryButtonLink?: string;
  secondaryButton: string;
  secondaryButtonAction?: string;
  secondaryButtonLink?: string;
  onButtonClick: (action: string | undefined, link: string | undefined) => void;
}

const SlideContent = ({
  title,
  description,
  primaryButton,
  primaryButtonAction,
  primaryButtonLink,
  secondaryButton,
  secondaryButtonAction,
  secondaryButtonLink,
  onButtonClick,
}: SlideContentProps) => {
  return (
    <div className="max-w-2xl text-white">
      <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg md:text-xl mb-8">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
        {primaryButtonAction === "appointment" ? (
          <AppointmentModal />
        ) : (
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-[#622426] hover:bg-[#622426]/90"
            onClick={() => onButtonClick(primaryButtonAction, primaryButtonLink)}
          >
            {primaryButton}
          </Button>
        )}
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full sm:w-auto border-white text-[#622426] hover:bg-white hover:text-[#622426] bg-white"
          onClick={() => onButtonClick(secondaryButtonAction, secondaryButtonLink)}
        >
          {secondaryButton}
        </Button>
      </div>
    </div>
  );
};

export default SlideContent;