import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();
    console.log('Received contact form submission:', { name, email, message });

    if (!name || !email || !message) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await resend.emails.send({
      from: 'Jalaram Diagnostic Center <onboarding@resend.dev>',
      to: ['brianrop36@gmail.com'],
      subject: `New Contact Form Message from ${name}`,
      reply_to: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #622426;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666;">This message was sent from the Jalaram Diagnostic Center contact form.</p>
        </div>
      `
    });

    console.log('Email sending response:', { data, error });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error: any) {
    console.error('Error in send-contact-email:', error);
    
    const errorMessage = error.message?.includes('domain is not verified') 
      ? 'We are currently setting up our email service. Your message has been logged, and we will get back to you soon. For immediate assistance, please contact us directly at brianrop36@gmail.com.'
      : 'Failed to send message. Please try again later or contact us directly.';
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: errorMessage
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
}

serve(handler);