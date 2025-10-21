import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { useUserShop } from '../hooks/useShops';

interface ComplianceQuestionnaireProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplianceQuestionnaire: React.FC<ComplianceQuestionnaireProps> = ({ isOpen, onClose }) => {
  const { shop } = useUserShop();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Registration
    hasBusinessRegistration: '',
    businessRegNumber: '',
    hasTaxClearance: '',
    taxNumber: '',
    hasTradingLicense: '',
    licenseNumber: '',
    
    // Health & Safety
    hasFireSafety: '',
    hasHealthCertificate: '',
    hasInsurance: '',
    safetyTraining: '',
    
    // Operational
    businessType: shop?.business_type || '',
    yearsInOperation: '',
    numberOfEmployees: '',
    
    // Compliance Commitment
    commitToComply: false,
    understandRequirements: false
  });

  const totalSteps = 4;

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!shop) return toast.error('No shop found');
      
      // Calculate initial compliance score based on answers
      let score = 0;
      if (formData.hasBusinessRegistration === 'yes') score += 10;
      if (formData.hasTaxClearance === 'yes') score += 10;
      if (formData.hasTradingLicense === 'yes') score += 10;
      if (formData.hasFireSafety === 'yes') score += 20;
      if (formData.hasHealthCertificate === 'yes') score += 20;
      if (formData.hasInsurance === 'yes') score += 15;
      if (formData.safetyTraining === 'yes') score += 15;

      // Update shop with questionnaire data
      const { error } = await supabase
        .from('shops')
        .update({ 
          compliance_score: score,
          business_type: formData.businessType
        })
        .eq('id', shop.id);

      if (error) throw error;

      // Create activity
      await supabase.from('activities').insert({
        user_id: shop.owner_id,
        shop_id: shop.id,
        type: 'compliance',
        description: 'Completed compliance questionnaire',
        metadata: { score, timestamp: new Date().toISOString() }
      });

      toast.success('Questionnaire submitted successfully! Please proceed to upload required documents.');
      onClose();
    } catch {
      toast.error('Failed to submit questionnaire');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compliance Questionnaire</h2>
            <p className="text-sm text-gray-600 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Business Registration */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Registration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Do you have a valid business registration certificate?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasBusinessRegistration"
                      value="yes"
                      checked={formData.hasBusinessRegistration === 'yes'}
                      onChange={(e) => handleInputChange('hasBusinessRegistration', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasBusinessRegistration"
                      value="no"
                      checked={formData.hasBusinessRegistration === 'no'}
                      onChange={(e) => handleInputChange('hasBusinessRegistration', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.hasBusinessRegistration === 'yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.businessRegNumber}
                    onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 2023/123456/07"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Do you have a valid tax clearance certificate?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasTaxClearance"
                      value="yes"
                      checked={formData.hasTaxClearance === 'yes'}
                      onChange={(e) => handleInputChange('hasTaxClearance', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasTaxClearance"
                      value="no"
                      checked={formData.hasTaxClearance === 'no'}
                      onChange={(e) => handleInputChange('hasTaxClearance', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Do you have a municipal trading license?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasTradingLicense"
                      value="yes"
                      checked={formData.hasTradingLicense === 'yes'}
                      onChange={(e) => handleInputChange('hasTradingLicense', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasTradingLicense"
                      value="no"
                      checked={formData.hasTradingLicense === 'no'}
                      onChange={(e) => handleInputChange('hasTradingLicense', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health & Safety */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health & Safety</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Do you have a fire safety compliance certificate?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasFireSafety"
                      value="yes"
                      checked={formData.hasFireSafety === 'yes'}
                      onChange={(e) => handleInputChange('hasFireSafety', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasFireSafety"
                      value="no"
                      checked={formData.hasFireSafety === 'no'}
                      onChange={(e) => handleInputChange('hasFireSafety', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Do you have health department approval certificate?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasHealthCertificate"
                      value="yes"
                      checked={formData.hasHealthCertificate === 'yes'}
                      onChange={(e) => handleInputChange('hasHealthCertificate', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasHealthCertificate"
                      value="no"
                      checked={formData.hasHealthCertificate === 'no'}
                      onChange={(e) => handleInputChange('hasHealthCertificate', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Do you have business insurance?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasInsurance"
                      value="yes"
                      checked={formData.hasInsurance === 'yes'}
                      onChange={(e) => handleInputChange('hasInsurance', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasInsurance"
                      value="no"
                      checked={formData.hasInsurance === 'no'}
                      onChange={(e) => handleInputChange('hasInsurance', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Have your staff completed safety training?
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyTraining"
                      value="yes"
                      checked={formData.safetyTraining === 'yes'}
                      onChange={(e) => handleInputChange('safetyTraining', e.target.value)}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="safetyTraining"
                      value="no"
                      checked={formData.safetyTraining === 'no'}
                      onChange={(e) => handleInputChange('safetyTraining', e.target.value)}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Business Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select type</option>
                  <option value="convenience_store">Convenience Store</option>
                  <option value="general_dealer">General Dealer</option>
                  <option value="grocery_store">Grocery Store</option>
                  <option value="tuck_shop">Tuck Shop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Years in Operation
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.yearsInOperation}
                  onChange={(e) => handleInputChange('yearsInOperation', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Number of Employees
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 3"
                />
              </div>
            </div>
          )}

          {/* Step 4: Commitment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Commitment to Compliance</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  By completing this questionnaire, you're taking the first step towards full compliance.
                  Based on your answers, you'll receive guidance on required documents and next steps.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.commitToComply}
                    onChange={(e) => handleInputChange('commitToComply', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I commit to working towards full compliance with all SSRMS requirements
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.understandRequirements}
                    onChange={(e) => handleInputChange('understandRequirements', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I understand the requirements and agree to upload necessary documents
                  </span>
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Next Steps</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Upload required documents to your profile</li>
                      <li>• Wait for document review (3-5 business days)</li>
                      <li>• Schedule or await site inspection</li>
                      <li>• Receive your compliance certificate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.commitToComply || !formData.understandRequirements}
              className={`px-6 py-2 rounded-lg font-medium ${
                formData.commitToComply && formData.understandRequirements
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Questionnaire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceQuestionnaire;