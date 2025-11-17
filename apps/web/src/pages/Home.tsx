import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin text-6xl">⏳</div>
          <p className="text-xl text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-1 text-sm text-slate-300 shadow-lg shadow-slate-950/40">
            KOOMPI OAuth Integration
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Bitriel Web App
          </h1>
          <p className="text-lg text-slate-300">
            Secure authentication with KOOMPI OAuth 2.0
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/10 p-8 shadow-xl shadow-black/40">
            <div className="mb-2 text-6xl">🔐</div>
            <h2 className="text-2xl font-bold text-white">Welcome!</h2>
            <p className="max-w-md text-slate-300">
              Sign in with your KOOMPI account to get started.
            </p>
            <button
              type="button"
              className="rounded-full bg-indigo-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
              onClick={login}
            >
              Sign in with KOOMPI
            </button>
          </div>
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            <div className="rounded-2xl border border-emerald-800/50 bg-gradient-to-br from-emerald-900/20 via-slate-900/40 to-slate-900/10 p-8 shadow-xl shadow-black/40">
              <div className="mb-4 flex items-center justify-center gap-3">
                {user?.profile ? (
                  <img
                    src={user.profile}
                    alt={user.name || user.username || 'User'}
                    className="h-16 w-16 rounded-full border-2 border-emerald-500"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white">
                    {user?.name?.[0] || user?.username?.[0] || '?'}
                  </div>
                )}
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Welcome, {user?.name || user?.username || 'User'}!
              </h2>
              <p className="mb-4 text-sm text-emerald-400">You're successfully signed in</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/10 p-8 shadow-xl shadow-black/40">
              <h3 className="mb-4 text-xl font-bold text-white">Profile Information</h3>
              <div className="space-y-3 text-left">
                {user?.username && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Username:</span>
                    <span className="font-medium text-white">{user.username}</span>
                  </div>
                )}
                {user?.email && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-white">{user.email}</span>
                  </div>
                )}
                {user?.phone && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-medium text-white">{user.phone}</span>
                  </div>
                )}
                {user?.walletAddress && (
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Wallet:</span>
                    <span className="font-mono text-sm font-medium text-white">
                      {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">User ID:</span>
                  <span className="font-mono text-xs font-medium text-white">{user?.userId}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-red-500 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-red-500/30 transition hover:bg-red-400"
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
