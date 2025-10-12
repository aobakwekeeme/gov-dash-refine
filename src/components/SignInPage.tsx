import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthModal from './AuthModal';

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Check URL params for mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setAuthMode('signup');
    }
  }, [searchParams]);

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