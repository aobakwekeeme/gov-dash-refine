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
    const { shopId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get shop documents
    const { data: documents } = await supabase
      .from('documents')
      .select('status, expiry_date')
      .eq('shop_id', shopId);

    // Get shop inspections
    const { data: inspections } = await supabase
      .from('inspections')
      .select('score, completed_date')
      .eq('shop_id', shopId)
      .eq('status', 'completed')
      .not('score', 'is', null)
      .order('completed_date', { ascending: false })
      .limit(3);

    let score = 0;
    const factors: any = {};

    // Document compliance (40%)
    if (documents && documents.length > 0) {
      const approvedDocs = documents.filter(d => d.status === 'approved').length;
      const validDocs = documents.filter(d => {
        if (!d.expiry_date) return true;
        return new Date(d.expiry_date) > new Date();
      }).length;
      
      const docScore = ((approvedDocs + validDocs) / (documents.length * 2)) * 40;
      score += docScore;
      factors.documents = Math.round(docScore);
    }

    // Inspection scores (60%)
    if (inspections && inspections.length > 0) {
      const avgInspectionScore = inspections.reduce((sum, i) => sum + (i.score || 0), 0) / inspections.length;
      const inspectionScore = (avgInspectionScore / 100) * 60;
      score += inspectionScore;
      factors.inspections = Math.round(inspectionScore);
    }

    const finalScore = Math.round(score);

    // Update shop
    const { error: shopError } = await supabase
      .from('shops')
      .update({ 
        compliance_score: finalScore,
        last_compliance_check: new Date().toISOString(),
        compliance_status: finalScore >= 80 ? 'compliant' : finalScore >= 60 ? 'warning' : 'non_compliant'
      })
      .eq('id', shopId);

    if (shopError) throw shopError;

    // Record in compliance history
    await supabase
      .from('compliance_history')
      .insert({
        shop_id: shopId,
        score: finalScore,
        factors,
      });

    return new Response(
      JSON.stringify({ success: true, score: finalScore, factors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in calculate-compliance:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
