import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X } from 'lucide-react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { meetsMinimumRequirements } from '../utils/passwordValidation';
import { validateEmail, validatePhone } from '../utils/inputValidation';

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const { signUp } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    department: ''
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    // Validate phone if provided
    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || 'Invalid phone number');
        return;
      }
    }

    if (!meetsMinimumRequirements(formData.password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      full_name: formData.fullName,
      role: selectedRole,
      phone: formData.phone
    };

    const { error: signUpError } = await signUp(formData.email, formData.password, userData);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      onSuccess();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const roles = [
    { id: 'customer', title: 'Customer', description: 'Browse and review local shops' },
    { id: 'shop_owner', title: 'Shop Owner', description: 'Manage your shop and compliance' },
    { id: 'government_official', title: 'Government Official', description: 'Monitor and regulate shops' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                      selectedRole === role.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={selectedRole === role.id}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{role.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                        selectedRole === role.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedRole === role.id && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role-specific fields */}
            {selectedRole === 'shop_owner' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {selectedRole === 'government_official' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {/* Account Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <PasswordStrengthIndicator password={formData.password} show={true} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onClose}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}