
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()
    console.log('Received contact form submission:', { name, email, message });

    if (!name || !email || !message) {
      throw new Error('Missing required fields');
    }

    // In development, we'll send to brianrop36@gmail.com
    // In production, you should use a verified domain
    const { data, error } = await resend.emails.send({
      from: 'Hospital Contact <brianrop36@gmail.com>',
      to: ['brianrop36@gmail.com'],
      subject: `New Contact Form Message from ${name}`,
      reply_to: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #221F26;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });

    console.log('Email sending response:', { data, error });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in send-contact-email:', error);
    
    // Provide a more user-friendly error message
    const errorMessage = error.message.includes('verify a domain') 
      ? 'Our email service is in development mode. Your message has been logged but email delivery is limited. Please contact us directly at brianrop36@gmail.com.'
      : 'Failed to send message. Please try again.';
    
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
})
