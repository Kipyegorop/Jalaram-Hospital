import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppointmentForm from "./AppointmentForm";

const AppointmentModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent hover:bg-white/10 text-white border-white">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill in your details below to schedule an appointment with one of our doctors.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)] sm:h-auto px-1">
          <AppointmentForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;