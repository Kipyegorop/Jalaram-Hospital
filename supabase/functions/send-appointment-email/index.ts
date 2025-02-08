
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentEmailRequest {
  name: string;
  email: string;
  date: string;
  time: string;
  department: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { name, email, date, time, department }: AppointmentEmailRequest = body;

    if (!name || !email || !date || !time || !department) {
      console.error("Missing required fields in request");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }

    const emailResponse = await resend.emails.send({
      from: "Hospital Appointments <onboarding@resend.dev>",
      to: [email],
      subject: "Your Appointment Confirmation",
      html: `
        <h1>Appointment Confirmation</h1>
        <p>Dear ${name},</p>
        <p>Your appointment has been successfully scheduled!</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Date: ${date}</li>
          <li>Time: ${time}</li>
          <li>Department: ${department}</li>
        </ul>
        <p>If you need to reschedule or cancel your appointment, please contact us.</p>
        <p>Best regards,<br>Hospital Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-appointment-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString() 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
