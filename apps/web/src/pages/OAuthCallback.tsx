import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the full URL from the backend callback
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const errorParam = urlParams.get('error');

        if (errorParam) {
          setError(errorParam);
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!token) {
          // If no token in URL params, the backend returns JSON response
          // We need to handle this case
          setError('No authentication token received');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        await setAuthToken(token);
        navigate('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate, setAuthToken]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-800/50 bg-gradient-to-br from-red-900/20 via-slate-900/40 to-slate-900/10 p-8 text-center shadow-xl">
          <div className="mb-4 text-6xl">❌</div>
          <h1 className="mb-2 text-2xl font-bold text-red-400">Authentication Failed</h1>
          <p className="mb-4 text-slate-300">{error}</p>
          <p className="text-sm text-slate-400">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/10 p-8 text-center shadow-xl">
        <div className="mb-6 inline-block animate-spin text-6xl">⏳</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Authenticating...</h1>
        <p className="text-slate-300">Please wait while we complete your login.</p>
      </div>
    </div>
  );
}
