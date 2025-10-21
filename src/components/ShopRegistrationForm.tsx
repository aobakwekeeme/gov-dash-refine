import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, MapPin, Clock, DollarSign, FileText, Building2 } from 'lucide-react';
import { validateEmail, validatePhone, validateText } from '../utils/inputValidation';

const BUSINESS_TYPES = [
  'Spaza Shop', 'General Store', 'Grocery Store', 'Convenience Store',
  'Fast Food', 'Restaurant', 'Bakery', 'Butchery', 'Hardware Store',
  'Clothing Store', 'Electronics', 'Pharmacy', 'Other'
];

const CATEGORIES = [
  'Food & Beverages', 'Groceries', 'Electronics', 'Clothing', 'Hardware',
  'Health & Beauty', 'Automotive', 'Home & Garden', 'Sports & Recreation', 'Other'
];

const PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo',
  'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

interface TradingHours {
  [key: string]: { open: string; close: string; closed: boolean };
}

const ShopRegistrationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    business_type: '',
    categories: [] as string[],
  });

  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    province: '',
    postal_code: '',
  });

  const [businessInfo, setBusinessInfo] = useState({
    business_registration_number: '',
    vat_number: '',
    trading_license_number: '',
    tax_clearance_certificate: '',
    zoning_certificate: '',
  });

  const [tradingHours, setTradingHours] = useState<TradingHours>({
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '08:00', close: '16:00', closed: false },
    sunday: { open: '09:00', close: '15:00', closed: false },
  });

  const [bankDetails, setBankDetails] = useState({
    bank_name: '',
    account_holder_name: '',
    account_number: '',
    branch_code: '',
    account_type: 'current',
  });

  const handleSubmit = async () => {
    if (!user) return;

    // Validate inputs
    const nameValidation = validateText(basicInfo.name, 'Business name', 3, 200);
    if (!nameValidation.isValid) {
      toast.error(nameValidation.error);
      return;
    }

    const emailValidation = validateEmail(contactInfo.email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.error);
      return;
    }

    const phoneValidation = validatePhone(contactInfo.phone);
    if (!phoneValidation.isValid) {
      toast.error(phoneValidation.error);
      return;
    }

    try {
      setLoading(true);

      // Insert shop
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .insert({
          owner_id: user.id,
          name: basicInfo.name,
          description: basicInfo.description,
          business_type: basicInfo.business_type,
          categories: basicInfo.categories,
          phone: contactInfo.phone,
          email: contactInfo.email,
          address: `${contactInfo.address}, ${contactInfo.province} ${contactInfo.postal_code}`,
          business_registration_number: businessInfo.business_registration_number,
          vat_number: businessInfo.vat_number,
          trading_license_number: businessInfo.trading_license_number,
          tax_clearance_certificate: businessInfo.tax_clearance_certificate,
          zoning_certificate: businessInfo.zoning_certificate,
          trading_hours: tradingHours,
          status: 'pending',
        })
        .select()
        .single();

      if (shopError) throw shopError;

      // Insert bank details
      const { error: bankError } = await supabase
        .from('bank_details')
        .insert({
          shop_id: shop.id,
          ...bankDetails,
        });

      if (bankError) throw bankError;

      toast.success('Shop registered successfully! Your application is under review.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTradingHours = (day: string, field: string, value: string | boolean) => {
    setTradingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-gray-200">
              <Building2 className="mx-auto w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
              <p className="text-gray-600">Tell us about your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  value={basicInfo.business_type}
                  onChange={(e) => setBasicInfo({ ...basicInfo, business_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories *
                </label>
                <select
                  multiple
                  value={basicInfo.categories}
                  onChange={(e) => setBasicInfo({ 
                    ...basicInfo, 
                    categories: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  size={4}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe your business..."
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-gray-200">
              <MapPin className="mx-auto w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              <p className="text-gray-600">How can customers reach you?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+27 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Address *
                </label>
                <input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Street address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province *
                </label>
                <select
                  value={contactInfo.province}
                  onChange={(e) => setContactInfo({ ...contactInfo, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select province</option>
                  {PROVINCES.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  value={contactInfo.postal_code}
                  onChange={(e) => setContactInfo({ ...contactInfo, postal_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="0000"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-gray-200">
              <FileText className="mx-auto w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Legal Documentation</h2>
              <p className="text-gray-600">South African business compliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Registration Number *
                </label>
                <input
                  type="text"
                  value={businessInfo.business_registration_number}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, business_registration_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="CIPC Registration Number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number
                </label>
                <input
                  type="text"
                  value={businessInfo.vat_number}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, vat_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="4XXXXXXXXX (if applicable)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trading License Number
                </label>
                <input
                  type="text"
                  value={businessInfo.trading_license_number}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, trading_license_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Municipal trading license"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Clearance Certificate
                </label>
                <input
                  type="text"
                  value={businessInfo.tax_clearance_certificate}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, tax_clearance_certificate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="SARS clearance certificate"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoning Certificate
                </label>
                <input
                  type="text"
                  value={businessInfo.zoning_certificate}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, zoning_certificate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Municipal zoning compliance certificate"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-gray-200">
              <Clock className="mx-auto w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Trading Hours</h2>
              <p className="text-gray-600">When are you open for business?</p>
            </div>

            <div className="space-y-4">
              {Object.entries(tradingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24">
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      onChange={(e) => updateTradingHours(day, 'closed', !e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span className="text-sm">Open</span>
                  </div>
                  {!hours.closed && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateTradingHours(day, 'open', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateTradingHours(day, 'close', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center pb-6 border-b border-gray-200">
              <DollarSign className="mx-auto w-12 h-12 text-teal-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Banking Details</h2>
              <p className="text-gray-600">For payments and financial transactions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <select
                  value={bankDetails.bank_name}
                  onChange={(e) => setBankDetails({ ...bankDetails, bank_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select bank</option>
                  <option value="ABSA">ABSA</option>
                  <option value="Capitec">Capitec Bank</option>
                  <option value="FNB">First National Bank (FNB)</option>
                  <option value="Nedbank">Nedbank</option>
                  <option value="Standard Bank">Standard Bank</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type *
                </label>
                <select
                  value={bankDetails.account_type}
                  onChange={(e) => setBankDetails({ ...bankDetails, account_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="current">Current Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  value={bankDetails.account_holder_name}
                  onChange={(e) => setBankDetails({ ...bankDetails, account_holder_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Name on bank account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={bankDetails.account_number}
                  onChange={(e) => setBankDetails({ ...bankDetails, account_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Bank account number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Code *
                </label>
                <input
                  type="text"
                  value={bankDetails.branch_code}
                  onChange={(e) => setBankDetails({ ...bankDetails, branch_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="6-digit branch code"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return basicInfo.name && basicInfo.business_type && basicInfo.categories.length > 0;
      case 2:
        return contactInfo.phone && contactInfo.email && contactInfo.address && contactInfo.province && contactInfo.postal_code;
      case 3:
        return businessInfo.business_registration_number;
      case 4:
        return true; // Trading hours are always valid
      case 5:
        return bankDetails.bank_name && bankDetails.account_holder_name && bankDetails.account_number && bankDetails.branch_code;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Shop</h1>
          <p className="text-gray-600">Complete all steps to register your business with SSRMS</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  stepNumber <= step ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || loading}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationForm;