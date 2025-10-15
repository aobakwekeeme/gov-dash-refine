import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, type, title, message, shopId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create notification in database
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        shop_id: shopId,
      });

    if (notifError) throw notifError;

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    // Get user email from auth.users
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);

    if (user?.email) {
      const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
      
      const { error: emailError } = await resend.emails.send({
        from: 'Shop Compliance <onboarding@resend.dev>',
        to: [user.email],
        subject: title,
        html: `
          <h1>${title}</h1>
          <p>Hello ${profile?.full_name || 'there'},</p>
          <p>${message}</p>
          <p>Best regards,<br>Shop Compliance Team</p>
        `,
      });

      if (emailError) {
        console.error('Email error:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
