-- Create profiles table for user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  department TEXT,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shops table
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  registration_number TEXT,
  address TEXT NOT NULL,
  province TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  compliance_score INTEGER DEFAULT 0,
  compliance_status TEXT DEFAULT 'pending',
  last_compliance_check TIMESTAMPTZ,
  next_inspection_date DATE,
  trading_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bank_details table
CREATE TABLE bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_type TEXT NOT NULL,
  branch_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  expiry_date DATE,
  expiry_reminder_sent BOOLEAN DEFAULT FALSE,
  last_reminder_date TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT
);

-- Create inspections table
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  inspector_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled' NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  completed_date TIMESTAMPTZ,
  score INTEGER,
  notes TEXT,
  issues TEXT[],
  report_url TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shop_id)
);

-- Create activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification_templates table
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT,
  email_body TEXT,
  sms_body TEXT,
  variables JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notification_log table
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id),
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create compliance_history table
CREATE TABLE compliance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) NOT NULL,
  score INTEGER NOT NULL,
  factors JSONB,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Shops policies
CREATE POLICY "Anyone can view approved shops" ON shops FOR SELECT USING (status = 'approved' OR owner_id = auth.uid());
CREATE POLICY "Shop owners can insert their shops" ON shops FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Shop owners can update their shops" ON shops FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Service role can update all shops" ON shops FOR UPDATE TO service_role USING (true);

-- Bank details policies
CREATE POLICY "Shop owners can view their bank details" ON bank_details FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "Shop owners can insert their bank details" ON bank_details FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);

-- Documents policies
CREATE POLICY "Shop owners can view their documents" ON documents FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "Shop owners can insert their documents" ON documents FOR INSERT WITH CHECK (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "Service role can update all documents" ON documents FOR UPDATE TO service_role USING (true);

-- Inspections policies
CREATE POLICY "Users can view inspections for their shops" ON inspections FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid()) OR inspector_id = auth.uid()
);
CREATE POLICY "Service role can manage inspections" ON inspections FOR ALL TO service_role USING (true);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can view their activities" ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert activities" ON activities FOR INSERT TO service_role WITH CHECK (true);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert notifications" ON notifications FOR ALL TO service_role USING (true);

-- Notification templates policies
CREATE POLICY "Users can view notification templates" ON notification_templates FOR SELECT TO authenticated USING (true);

-- Notification log policies
CREATE POLICY "Service role can manage notification logs" ON notification_log FOR ALL TO service_role USING (true);

-- Compliance history policies
CREATE POLICY "Shop owners can view their compliance history" ON compliance_history FOR SELECT USING (
  shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
);
CREATE POLICY "Service role can manage compliance history" ON compliance_history FOR ALL TO service_role USING (true);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default notification templates
INSERT INTO notification_templates (name, subject, email_body, variables) VALUES
('inspection_reminder', 'Upcoming Inspection Reminder', 
 'Dear {{shop_name}},\n\nThis is a reminder that your inspection is scheduled for {{inspection_date}} at {{inspection_time}}.\n\nPlease ensure all required documents are ready for review.\n\nBest regards,\nCompliance Team', 
 '{"shop_name": "string", "inspection_date": "string", "inspection_time": "string"}'),
('document_expiring', 'Document Expiring Soon', 
 'Dear {{shop_name}},\n\nYour {{document_type}} will expire on {{expiry_date}}.\n\nPlease renew this document to maintain compliance.\n\nDays remaining: {{days_remaining}}\n\nBest regards,\nCompliance Team', 
 '{"shop_name": "string", "document_type": "string", "expiry_date": "string", "days_remaining": "number"}'),
('compliance_alert', 'Compliance Score Alert', 
 'Dear {{shop_name}},\n\nYour compliance score has dropped to {{score}}%.\n\nReasons:\n{{reasons}}\n\nPlease take action to improve your compliance status.\n\nBest regards,\nCompliance Team', 
 '{"shop_name": "string", "score": "number", "reasons": "string"}'),
('registration_approved', 'Shop Registration Approved', 
 'Dear {{shop_name}},\n\nCongratulations! Your shop registration has been approved.\n\nYou can now access all features of the platform.\n\nBest regards,\nCompliance Team', 
 '{"shop_name": "string"}'),
('inspection_complete', 'Inspection Completed', 
 'Dear {{shop_name}},\n\nYour inspection has been completed.\n\nScore: {{score}}/100\nStatus: {{status}}\n\nA detailed report is available in your dashboard.\n\nBest regards,\nCompliance Team', 
 '{"shop_name": "string", "score": "number", "status": "string"}'),
('document_approved', 'Document Verified', 
 'Dear {{shop_name}},\n\nYour {{document_type}} has been verified and approved.\n\nThank you for maintaining compliance.\n\nBest regards,\nCompliance Team', 
 '{"shop_name": "string", "document_type": "string"}');