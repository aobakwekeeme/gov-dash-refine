import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find documents expiring in 30 days
    const { data: expiringDocs } = await supabase
      .from('documents')
      .select('id, shop_id, name, expiry_date, shops(owner_id, name)')
      .lte('expiry_date', in30Days.toISOString().split('T')[0])
      .gte('expiry_date', today.toISOString().split('T')[0])
      .eq('expiry_reminder_sent', false);

    if (expiringDocs) {
      for (const doc of expiringDocs) {
        const shop = doc.shops as any;
        
        // Create notification
        await supabase.from('notifications').insert({
          user_id: shop.owner_id,
          type: 'document_expiry',
          title: 'Document Expiring Soon',
          message: `Your document "${doc.name}" for ${shop.name} will expire on ${new Date(doc.expiry_date).toLocaleDateString()}`,
          shop_id: doc.shop_id,
        });

        // Mark reminder as sent
        await supabase
          .from('documents')
          .update({ expiry_reminder_sent: true, last_reminder_date: new Date().toISOString() })
          .eq('id', doc.id);
      }
    }

    // Find upcoming inspections (within 7 days)
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const { data: upcomingInspections } = await supabase
      .from('inspections')
      .select('id, shop_id, scheduled_date, type, shops(owner_id, name)')
      .eq('status', 'scheduled')
      .lte('scheduled_date', in7Days.toISOString())
      .gte('scheduled_date', today.toISOString())
      .eq('reminder_sent', false);

    if (upcomingInspections) {
      for (const inspection of upcomingInspections) {
        const shop = inspection.shops as any;
        
        // Create notification
        await supabase.from('notifications').insert({
          user_id: shop.owner_id,
          type: 'inspection_reminder',
          title: 'Upcoming Inspection',
          message: `Your ${inspection.type} inspection for ${shop.name} is scheduled for ${new Date(inspection.scheduled_date).toLocaleDateString()}`,
          shop_id: inspection.shop_id,
        });

        // Mark reminder as sent
        await supabase
          .from('inspections')
          .update({ reminder_sent: true })
          .eq('id', inspection.id);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        documentReminders: expiringDocs?.length || 0,
        inspectionReminders: upcomingInspections?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
