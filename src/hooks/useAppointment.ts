import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AppointmentFormData } from "@/components/appointment/types";

export const useAppointment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const sendConfirmationEmail = async (data: AppointmentFormData, date: Date) => {
    try {
      const { error } = await supabase.functions.invoke('send-appointment-email', {
        body: {
          name: data.name,
          email: data.email,
          date: date.toLocaleDateString(),
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
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error(`No doctor available for ${department} department`);
    }
    return data.id;
  };

  const submitAppointment = async (data: AppointmentFormData, date: Date) => {
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
          appointment_date: date.toISOString().split('T')[0],
          appointment_time: data.time,
          reason: data.reason,
          doctor_id: doctorId,
          status: 'pending',
        });

      if (appointmentError) throw appointmentError;

      await sendConfirmationEmail(data, date);
      
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
        description: `Your appointment has been scheduled for ${date.toLocaleDateString()} at ${data.time}. We'll send you a confirmation email shortly.`,
      });

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

  return {
    isLoading,
    error,
    countdown,
    submitAppointment,
  };
};