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
    const { shopId, status, reviewerNotes } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update shop status
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .update({ status })
      .eq('id', shopId)
      .select('owner_id, name')
      .single();

    if (shopError) throw shopError;

    // Create notification for shop owner
    let message = '';
    if (status === 'approved') {
      message = `Congratulations! Your shop ${shop.name} has been approved.`;
    } else if (status === 'rejected') {
      message = `Your shop ${shop.name} registration has been rejected. ${reviewerNotes || 'Please review the requirements and reapply.'}`;
    } else if (status === 'suspended') {
      message = `Your shop ${shop.name} has been suspended. ${reviewerNotes || 'Please contact support for more information.'}`;
    }

    await supabase.from('notifications').insert({
      user_id: shop.owner_id,
      type: 'shop_status_update',
      title: `Shop Status Update: ${status}`,
      message,
      shop_id: shopId,
    });

    // Create activity log
    await supabase.from('activities').insert({
      user_id: shop.owner_id,
      shop_id: shopId,
      type: 'shop_status_changed',
      description: `Shop status changed to ${status}`,
      metadata: { notes: reviewerNotes },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-shop-status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
