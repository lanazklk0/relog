import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginButton from './components/LoginButton';
import UserCard from './components/UserCard';
import SessionStatus from './components/SessionStatus';

// Spinner component
function Spinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        className="w-12 h-12 text-gray-400 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p className="text-gray-400 text-sm">Verificando sessão...</p>
    </div>
  );
}

// GitHub logo large
function GitHubLogo() {
  return (
    <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub logo">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.12 3.176.77.838 1.232 1.91 1.232 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function App() {
  const { user, loading, sessionExpired, error, login, logout, relogin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 font-sans">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <GitHubLogo />
          <h1 className="text-white text-3xl font-extrabold tracking-tight">Relog</h1>
          <p className="text-gray-400 text-sm text-center max-w-xs">
            Re-login automático no GitHub — nunca perca sua sessão de novo.
          </p>
        </div>

        {/* Main content area */}
        {loading ? (
          <Spinner />
        ) : sessionExpired ? (
          <SessionStatus
            sessionExpired={sessionExpired}
            error={error}
            onRelogin={relogin}
          />
        ) : user ? (
          <UserCard user={user} onLogout={logout} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            {error && (
              <p className="text-red-400 text-sm bg-red-950/50 border border-red-800/50 px-4 py-2 rounded-lg">
                {error}
              </p>
            )}
            <LoginButton onLogin={login} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-gray-600 text-xs text-center mt-4">
          Sessão verificada automaticamente a cada 30 segundos.
        </footer>
      </div>
    </div>
  );
}
