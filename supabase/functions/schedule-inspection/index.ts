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
    const { shopId, inspectorId, type, scheduledDate } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create inspection
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .insert({
        shop_id: shopId,
        inspector_id: inspectorId,
        type,
        scheduled_date: scheduledDate,
        status: 'scheduled',
      })
      .select()
      .single();

    if (inspectionError) throw inspectionError;

    // Update shop's next inspection date
    const { error: shopError } = await supabase
      .from('shops')
      .update({ next_inspection_date: scheduledDate })
      .eq('id', shopId);

    if (shopError) console.error('Error updating shop:', shopError);

    // Get shop owner
    const { data: shop } = await supabase
      .from('shops')
      .select('owner_id, name')
      .eq('id', shopId)
      .single();

    // Create notification for shop owner
    if (shop) {
      await supabase.from('notifications').insert({
        user_id: shop.owner_id,
        type: 'inspection_scheduled',
        title: 'Inspection Scheduled',
        message: `An inspection has been scheduled for ${shop.name} on ${new Date(scheduledDate).toLocaleDateString()}`,
        shop_id: shopId,
      });
    }

    return new Response(
      JSON.stringify({ success: true, inspection }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in schedule-inspection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
