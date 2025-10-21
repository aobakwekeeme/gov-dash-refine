import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import ForgotPasswordModal from './ForgotPasswordModal';
import { meetsMinimumRequirements } from '../utils/passwordValidation';
import { validateEmail } from '../utils/inputValidation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  defaultRole?: 'customer' | 'shop_owner' | 'government_official';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange, defaultRole = 'customer' }) => {
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: defaultRole,
    name: '',
    phone: '',
    address: '',
    businessName: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message || 'Invalid email or password');
        } else {
          onClose();
        }
      } else {
        // Validate password strength for signup
        if (!meetsMinimumRequirements(formData.password)) {
          setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
          return;
        }
        
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.name,
          role: formData.userType as 'customer' | 'shop_owner' | 'government_official',
          phone: formData.phone
        });

        if (error) {
          setError(error.message || 'Registration failed');
        } else {
          setEmailConfirmationSent(true);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message || 'Google sign-in failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetModal = () => {
    setFormData({
      email: '',
      password: '',
      userType: defaultRole,
      name: '',
      phone: '',
      address: '',
      businessName: '',
      department: ''
    });
    setError('');
    setShowPassword(false);
    setEmailConfirmationSent(false);
  };

  // Update userType when defaultRole changes
  React.useEffect(() => {
    if (mode === 'signup') {
      setFormData(prev => ({ ...prev, userType: defaultRole }));
    }
  }, [defaultRole, mode]);

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    resetModal();
    onModeChange(newMode);
  };

  if (!isOpen) return null;

  // Email confirmation screen
  if (emailConfirmationSent) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmation Email Sent
              </h3>
              
              <p className="text-gray-600 mb-6">
                We've sent a confirmation link to <strong>{formData.email}</strong>. 
                Click the link in your email to activate your account and sign in automatically.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900">What happens next?</p>
                    <ul className="text-sm text-blue-800 mt-1 space-y-1">
                      <li>• Check your email inbox (and spam folder)</li>
                      <li>• Click the confirmation link</li>
                      <li>• You'll be automatically signed in</li>
                      <li>• Access your personalized dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center text-white">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <img src="/logo.png" alt="SSRMS Logo" className="w-10 h-10 rounded-lg" />
                <h2 className="text-2xl font-bold">
                  {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h2>
              </div>
              <p className="text-white/90 mt-1">
                {mode === 'signin' 
                  ? 'Sign in to access your dashboard' 
                  : 'Join the Spaza Shop Registry community'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                I am a *
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              >
                <option value="customer">Customer - Find and review spaza shops</option>
                <option value="shop_owner">Shop Owner - Register and manage my spaza shop</option>
                <option value="government_official">Government Official - Verify and monitor shops</option>
              </select>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Enter your email address"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="Enter your phone number"
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="Enter your address"
              />
            </div>
          )}

          {mode === 'signup' && formData.userType === 'shop_owner' && (
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="Enter your business name"
              />
            </div>
          )}

          {mode === 'signup' && formData.userType === 'government_official' && (
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="Enter your department"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {mode === 'signup' && (
              <PasswordStrengthIndicator password={formData.password} show={true} />
            )}
            
            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <ForgotPasswordModal 
            isOpen={showForgotPassword} 
            onClose={() => setShowForgotPassword(false)} 
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 focus:ring-4 focus:ring-teal-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            <span className={loading ? 'opacity-0' : ''}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign {mode === 'signin' ? 'in' : 'up'} with Google
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => handleModeChange(mode === 'signin' ? 'signup' : 'signin')}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default AuthModal;