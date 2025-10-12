-- Add province and district municipality columns to shops table
ALTER TABLE public.shops 
ADD COLUMN province text,
ADD COLUMN district_municipality text;

-- Add indexes for better query performance when filtering by location
CREATE INDEX idx_shops_province ON public.shops(province);
CREATE INDEX idx_shops_district_municipality ON public.shops(district_municipality);
CREATE INDEX idx_shops_province_district ON public.shops(province, district_municipality);