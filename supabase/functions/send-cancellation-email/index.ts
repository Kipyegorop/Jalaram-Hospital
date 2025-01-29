import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CancellationEmailRequest {
  patientEmail: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientEmail, patientName, appointmentDate, appointmentTime, reason }: CancellationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Hospital Appointments <onboarding@resend.dev>",
      to: [patientEmail],
      subject: "Your Appointment Has Been Cancelled",
      html: `
        <h1>Appointment Cancellation Notice</h1>
        <p>Dear ${patientName},</p>
        <p>We regret to inform you that your appointment scheduled for:</p>
        <ul>
          <li>Date: ${appointmentDate}</li>
          <li>Time: ${appointmentTime}</li>
        </ul>
        <p><strong>Reason for cancellation:</strong> ${reason}</p>
        <p>Please contact us to reschedule your appointment.</p>
        <p>Best regards,<br>Hospital Team</p>
      `,
    });

    console.log("Cancellation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-cancellation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);