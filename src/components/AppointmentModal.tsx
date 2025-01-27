import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppointmentForm from "./AppointmentForm";

interface AppointmentModalProps {
  triggerClassName?: string;
}

const AppointmentModal = ({ triggerClassName }: AppointmentModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>Book Appointment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule an Appointment</DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule your appointment. We'll send you a
            confirmation email with the details.
          </DialogDescription>
        </DialogHeader>
        <AppointmentForm />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;