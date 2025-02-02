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
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import AppointmentForm from "./AppointmentForm";

const AppointmentModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent hover:bg-white/10 text-white border-white">
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[90vh]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill in your details below to schedule an appointment with one of our doctors.
          </DialogDescription>
        </DialogHeader>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} className="p-4">
            <ScrollArea className="h-[calc(90vh-120px)]">
              <AppointmentForm />
            </ScrollArea>
          </ResizablePanel>
          <ResizablePanel defaultSize={50} className="p-4 bg-muted/10">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Information</h3>
              <p className="text-sm text-muted-foreground">
                Please note:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Appointments are subject to doctor availability</li>
                <li>You will receive a confirmation email once booked</li>
                <li>Please arrive 15 minutes before your appointment</li>
                <li>Bring any relevant medical records</li>
              </ul>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;