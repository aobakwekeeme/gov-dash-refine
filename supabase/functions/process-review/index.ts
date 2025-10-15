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
    const { shopId, userId, rating, comment } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        shop_id: shopId,
        user_id: userId,
        rating,
        comment,
      })
      .select()
      .single();

    if (reviewError) throw reviewError;

    // Create activity log
    await supabase.from('activities').insert({
      user_id: userId,
      shop_id: shopId,
      type: 'review_submitted',
      description: `Submitted a ${rating}-star review`,
    });

    // Get shop owner for notification
    const { data: shop } = await supabase
      .from('shops')
      .select('owner_id, name')
      .eq('id', shopId)
      .single();

    // Notify shop owner
    if (shop) {
      await supabase.from('notifications').insert({
        user_id: shop.owner_id,
        type: 'new_review',
        title: 'New Review',
        message: `You received a ${rating}-star review for ${shop.name}`,
        shop_id: shopId,
      });
    }

    return new Response(
      JSON.stringify({ success: true, review }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in process-review:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
