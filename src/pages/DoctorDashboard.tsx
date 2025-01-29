import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Phone, Clock, Mail, MessageSquare, LogOut } from "lucide-react";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  created_at: string;
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorName, setDoctorName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorInfo();
    fetchAppointments();
  }, []);

  const fetchDoctorInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: doctorData } = await supabase
        .from("doctors")
        .select("name")
        .eq("email", user.email)
        .single();
      
      if (doctorData) {
        // Extract first name
        const firstName = doctorData.name.split(' ')[0];
        setDoctorName(firstName);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-auth");
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
      return;
    }

    setAppointments(data || []);
  };

  const sendCancellationEmail = async (appointment: Appointment, reason: string) => {
    try {
      await supabase.functions.invoke("send-cancellation-email", {
        body: {
          patientEmail: appointment.patient_email,
          patientName: appointment.patient_name,
          appointmentDate: new Date(appointment.appointment_date).toLocaleDateString(),
          appointmentTime: appointment.appointment_time,
          reason: reason,
        },
      });
    } catch (error) {
      console.error("Error sending cancellation email:", error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (appointment: Appointment, status: string) => {
    if (status === "cancelled" && !cancelReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({ status, reason: cancelReason })
      .eq("id", appointment.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
      return;
    }

    if (status === "cancelled") {
      try {
        await sendCancellationEmail(appointment, cancelReason);
        toast({
          title: "Success",
          description: "Appointment cancelled and patient notified",
        });
      } catch (error) {
        toast({
          title: "Warning",
          description: "Appointment cancelled but failed to send email notification",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success",
        description: "Appointment status updated",
      });
    }

    setSelectedAppointment(null);
    setCancelReason("");
    fetchAppointments();
  };

  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber: string) => {
    window.location.href = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold text-primary">
            Welcome, Dr. {doctorName}
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto py-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-primary">Appointments Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Manage your patient appointments and schedule from this central dashboard.
          </p>
          
          <div className="rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Booked At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patient_name}</TableCell>
                    <TableCell>{new Date(appointment.appointment_date).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePhoneCall(appointment.patient_phone)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleWhatsApp(appointment.patient_phone)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        {new Date(appointment.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment, "confirmed")}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Please provide a reason for cancelling this appointment:</p>
            <Input
              placeholder="Enter cancellation reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAppointment(null)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedAppointment && updateAppointmentStatus(selectedAppointment, "cancelled")}
            >
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
