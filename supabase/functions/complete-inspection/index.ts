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
    const { inspectionId, score, notes, issues } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update inspection
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .update({
        status: 'completed',
        completed_date: new Date().toISOString(),
        score,
        notes,
        issues,
      })
      .eq('id', inspectionId)
      .select('shop_id')
      .single();

    if (inspectionError) throw inspectionError;

    // Get all completed inspections for this shop
    const { data: inspections } = await supabase
      .from('inspections')
      .select('score')
      .eq('shop_id', inspection.shop_id)
      .eq('status', 'completed')
      .not('score', 'is', null);

    // Calculate average compliance score
    let complianceScore = 0;
    if (inspections && inspections.length > 0) {
      const total = inspections.reduce((sum, i) => sum + (i.score || 0), 0);
      complianceScore = Math.round(total / inspections.length);
    }

    // Update shop compliance score
    const { error: shopError } = await supabase
      .from('shops')
      .update({ 
        compliance_score: complianceScore,
        last_compliance_check: new Date().toISOString(),
        compliance_status: complianceScore >= 80 ? 'compliant' : complianceScore >= 60 ? 'warning' : 'non_compliant'
      })
      .eq('id', inspection.shop_id);

    if (shopError) throw shopError;

    // Get shop owner for notification
    const { data: shop } = await supabase
      .from('shops')
      .select('owner_id, name')
      .eq('id', inspection.shop_id)
      .single();

    // Create notification
    if (shop) {
      await supabase.from('notifications').insert({
        user_id: shop.owner_id,
        type: 'inspection_completed',
        title: 'Inspection Completed',
        message: `Your inspection for ${shop.name} has been completed with a score of ${score}/100`,
        shop_id: inspection.shop_id,
      });
    }

    return new Response(
      JSON.stringify({ success: true, complianceScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in complete-inspection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
