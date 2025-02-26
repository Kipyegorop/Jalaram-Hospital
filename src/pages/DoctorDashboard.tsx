
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Phone, Clock, Mail, MessageSquare, LogOut, Calendar, Users, Activity, UserRound, Printer } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea";
import { DoctorProfileMenu } from "@/components/DoctorProfileMenu";
import type { Database } from "@/integrations/supabase/types";

type Doctor = Database['public']['Tables']['doctors']['Row'];

interface ProfileFormValues {
  specialization: string;
  experience: string;
  contact_details: string;
}

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
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<ProfileFormValues>();

  useEffect(() => {
    const initializeDashboard = async () => {
      await checkProfileCompletion();
      await fetchDoctorInfo();
      await fetchAppointments();
    };

    initializeDashboard();

    // Set up real-time subscription for appointment updates
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchAppointments(); // Refresh appointments when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkProfileCompletion = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: doctorData, error } = await supabase
        .from("doctors")
        .select("is_profile_complete")
        .eq("email", user.email)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch doctor profile",
          variant: "destructive",
        });
        return;
      }

      if (!doctorData.is_profile_complete) {
        setShowProfileForm(true);
      }
    }
  };

  const onProfileSubmit = async (data: ProfileFormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("doctors")
      .update({
        ...data,
        is_profile_complete: true
      })
      .eq("email", user.email);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    setShowProfileForm(false);
  };

  const fetchDoctorInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: doctor, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("email", user.email)
        .single();
      
      if (error) {
        console.error('Error fetching doctor info:', error);
        return;
      }
      
      if (doctor) {
        setDoctorData(doctor);
        setDoctorName(doctor.name);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/doctor-auth");
  };

  const fetchAppointments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return;
    }

    // First get the doctor's ID
    const { data: doctorData, error: doctorError } = await supabase
      .from("doctors")
      .select("id")
      .eq("email", user.email)
      .single();

    if (doctorError || !doctorData) {
      console.error('Error fetching doctor data:', doctorError);
      return;
    }

    console.log('Fetching appointments for doctor ID:', doctorData.id);

    // Then fetch appointments using the doctor's ID
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq('doctor_id', doctorData.id)
      .order("appointment_date", { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
      return;
    }

    console.log('Fetched appointments:', data);
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
    // Remove any non-numeric characters from the phone number
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    // Open WhatsApp with the formatted number
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const handlePrintReports = (period: 'today' | 'all') => {
    // Filter appointments based on period
    const filteredAppointments = period === 'today' 
      ? appointments.filter(apt => 
          new Date(apt.appointment_date).toDateString() === new Date().toDateString()
        )
      : appointments;

    // Create printable content
    const content = document.createElement('div');
    content.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 20px;">Appointments Report</h1>
      <h2 style="margin-bottom: 10px;">Dr. ${doctorName}</h2>
      <p style="margin-bottom: 20px;">Period: ${period === 'today' ? 'Today' : 'All Time'}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Patient Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Time</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAppointments.map(apt => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${apt.patient_name}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${new Date(apt.appointment_date).toLocaleDateString()}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${apt.appointment_time}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${apt.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(content.innerHTML);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-primary">
              Welcome, Dr. {doctorName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {doctorData && <DoctorProfileMenu doctorData={doctorData} />}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Stats */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Today's Appointments</h3>
                <p className="text-3xl font-bold text-primary">
                  {appointments.filter(apt => 
                    new Date(apt.appointment_date).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Total Patients</h3>
                <p className="text-3xl font-bold text-green-600">{appointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pending Reviews</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {appointments.filter(apt => apt.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900">Appointments Overview</h2>
            <p className="text-gray-500 mt-1">Manage and track your patient appointments</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Patient Info</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Time</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Booked At</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50">
                    <TableCell>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <UserRound className="h-8 w-8 text-gray-400" />
                            <span className="font-medium">{appointment.patient_name}</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Patient Details</h4>
                            <div className="text-sm">
                              <p><span className="font-medium">Name:</span> {appointment.patient_name}</p>
                              <p><span className="font-medium">Email:</span> {appointment.patient_email}</p>
                              <p><span className="font-medium">Phone:</span> {appointment.patient_phone}</p>
                              <p><span className="font-medium">Reason:</span> {appointment.reason}</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell>{new Date(appointment.appointment_date).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handlePhoneCall(appointment.patient_phone)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-green-50 hover:text-green-600"
                          onClick={() => handleWhatsApp(appointment.patient_phone)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        {new Date(appointment.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-50 hover:text-green-600"
                          onClick={() => updateAppointmentStatus(appointment, "confirmed")}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 hover:text-red-600"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Print Reports Buttons */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => handlePrintReports('today')}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Today's Reports
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePrintReports('all')}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print All Reports
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Appointment Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-gray-500">Please provide a reason for cancelling this appointment:</p>
            <Input
              placeholder="Enter cancellation reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full"
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
