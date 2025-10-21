import { useState } from 'react';
import AuthModal from './AuthModal';

export default function SignInPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <AuthModal
        isOpen={true}
        onClose={() => window.history.back()}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}