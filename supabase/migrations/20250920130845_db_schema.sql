-- Create shops table
CREATE TABLE public.shops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  business_registration_number TEXT,
  trading_hours JSONB,
  categories TEXT[],
  logo_url TEXT,
  banner_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  compliance_score INTEGER DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inspections table
CREATE TABLE public.inspections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  inspector_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('health', 'safety', 'compliance', 'licensing')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_date TIMESTAMP WITH TIME ZONE,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  notes TEXT,
  issues TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('business_license', 'health_certificate', 'tax_clearance', 'fire_safety', 'other')),
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expiry_date DATE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('shop_visit', 'document_upload', 'inspection_completed', 'review_posted', 'shop_registered', 'compliance_updated')),
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

-- Enable Row Level Security
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Shops policies
CREATE POLICY "Shops are viewable by everyone" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Shop owners can insert their own shops" ON public.shops FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Shop owners can update their own shops" ON public.shops FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Government officials can update any shop" ON public.shops FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'government_official')
);

-- Inspections policies
CREATE POLICY "Inspections are viewable by shop owners and government officials" ON public.inspections FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM public.shops WHERE id = shop_id
  ) OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'government_official')
);
CREATE POLICY "Government officials can manage inspections" ON public.inspections FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'government_official')
);

-- Documents policies
CREATE POLICY "Documents are viewable by shop owners and government officials" ON public.documents FOR SELECT USING (
  auth.uid() IN (
    SELECT owner_id FROM public.shops WHERE id = shop_id
  ) OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'government_official')
);
CREATE POLICY "Shop owners can manage their shop documents" ON public.documents FOR ALL USING (
  auth.uid() IN (
    SELECT owner_id FROM public.shops WHERE id = shop_id
  )
);
CREATE POLICY "Government officials can update document status" ON public.documents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'government_official')
);

-- Activities policies
CREATE POLICY "Users can view their own activities" ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities" ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX idx_shops_status ON public.shops(status);
CREATE INDEX idx_shops_location ON public.shops(latitude, longitude);
CREATE INDEX idx_inspections_shop_id ON public.inspections(shop_id);
CREATE INDEX idx_inspections_scheduled_date ON public.inspections(scheduled_date);
CREATE INDEX idx_documents_shop_id ON public.documents(shop_id);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_reviews_shop_id ON public.reviews(shop_id);