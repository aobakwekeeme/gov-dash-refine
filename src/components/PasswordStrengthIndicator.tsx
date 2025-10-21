import React from 'react';
import { validatePassword } from '../utils/passwordValidation';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password, show }) => {
  if (!show || !password) return null;

  const strength = validatePassword(password);
  const widthPercentage = (strength.score / 5) * 100;

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 text-gray-500" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-700">{strength.label}</span>
      </div>

      {/* Suggestions */}
      {strength.suggestions.length > 0 && (
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-start space-x-1">
            <AlertCircle className="w-3 h-3 mt-0.5 text-orange-500 flex-shrink-0" />
            <span className="font-medium">To strengthen your password:</span>
          </div>
          <ul className="ml-4 space-y-0.5">
            {strength.suggestions.map((suggestion, index) => (
              <li key={index}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {strength.score >= 4 && (
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>Password meets security requirements</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;