-- Add additional fields for business requirements
ALTER TABLE public.shops 
ADD COLUMN IF NOT EXISTS vat_number TEXT,
ADD COLUMN IF NOT EXISTS trading_license_number TEXT,
ADD COLUMN IF NOT EXISTS tax_clearance_certificate TEXT,
ADD COLUMN IF NOT EXISTS zoning_certificate TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT;

-- Create a bank_details table for secure financial information
CREATE TABLE IF NOT EXISTS public.bank_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL,
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  branch_code TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'current',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(shop_id)
);

-- Enable RLS on bank_details
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

-- Create policies for bank_details
CREATE POLICY "Shop owners can manage their bank details" 
ON public.bank_details 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.shops 
    WHERE shops.id = bank_details.shop_id 
    AND shops.owner_id = auth.uid()
  )
);

-- Add trigger for bank_details timestamps
CREATE TRIGGER update_bank_details_updated_at
  BEFORE UPDATE ON public.bank_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();