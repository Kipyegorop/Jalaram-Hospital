import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  reason: string;
  department: string;
}

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
    try {
      // Get doctor ID for the selected department
      const doctorId = await getDoctorByDepartment(data.department);

      // Save appointment to database
      const { error } = await supabase
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

      if (error) throw error;

      // Send confirmation email
      await sendConfirmationEmail(data);
      
      // Start countdown and redirect
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+254 XXX XXX XXX" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Preferred Date</FormLabel>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => date < new Date() || date.getDay() === 0}
            />
          </div>

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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

          <Button type="submit" className="w-full">
            Schedule Appointment
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;