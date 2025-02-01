import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoFields from "./appointment/PersonalInfoFields";
import AppointmentTimeFields from "./appointment/AppointmentTimeFields";
import DepartmentField from "./appointment/DepartmentField";
import type { AppointmentFormData } from "./appointment/types";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
];

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  const sendConfirmationEmail = async (data: AppointmentFormData) => {
    try {
      const { error } = await supabase.functions.invoke('send-appointment-email', {
        body: {
          name: data.name,
          email: data.email,
          date: date?.toLocaleDateString(),
          time: data.time,
          department: data.department,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw new Error('Failed to send confirmation email');
    }
  };

  const getDoctorByDepartment = async (department: string) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('id')
      .eq('department', department)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error(`No doctor available for ${department} department`);
    }
    return data.id;
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setIsLoading(true);
    setError(null);

    if (!date) {
      setError("Please select an appointment date");
      setIsLoading(false);
      return;
    }

    try {
      const doctorId = await getDoctorByDepartment(data.department);

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_name: data.name,
          patient_email: data.email,
          patient_phone: data.phone,
          appointment_date: date?.toISOString().split('T')[0],
          appointment_time: data.time,
          reason: data.reason,
          doctor_id: doctorId,
          status: 'pending',
        });

      if (appointmentError) throw appointmentError;

      await sendConfirmationEmail(data);
      
      setCountdown(5);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            navigate("/");
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Appointment Scheduled!",
        description: `Your appointment has been scheduled for ${date?.toLocaleDateString()} at ${data.time}. We'll send you a confirmation email shortly.`,
      });

      form.reset();
      setDate(undefined);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setError(error instanceof Error ? error.message : "Failed to schedule appointment. Please try again.");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Book an Appointment</h2>
      
      {countdown !== null && (
        <div className="text-center mb-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-600">
            Redirecting to homepage in {countdown} seconds...
          </p>
        </div>
      )}

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