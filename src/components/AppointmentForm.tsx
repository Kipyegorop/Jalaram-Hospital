import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PersonalInfoFields from "./appointment/PersonalInfoFields";
import AppointmentTimeFields from "./appointment/AppointmentTimeFields";
import DepartmentField from "./appointment/DepartmentField";
import CountdownAlert from "./appointment/CountdownAlert";
import { useAppointment } from "@/hooks/useAppointment";
import type { AppointmentFormData } from "./appointment/types";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const departments = [
  "General Medicine",
  "Pediatrics",
  "Orthopedics",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Dentist",
];

const AppointmentForm = () => {
  const [date, setDate] = useState<Date>();
  const { isLoading, error, countdown, submitAppointment } = useAppointment();
  
  const form = useForm<AppointmentFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reason: "",
      department: "",
      time: "",
    },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!date) return;
    await submitAppointment(data, date);
    form.reset();
    setDate(undefined);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Book an Appointment</h2>
      
      <CountdownAlert countdown={countdown} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields form={form} />
          <DepartmentField form={form} departments={departments} />
          <AppointmentTimeFields 
            form={form}
            date={date}
            setDate={setDate}
            timeSlots={timeSlots}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Visit</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please briefly describe your symptoms or reason for visit"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Appointment'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;