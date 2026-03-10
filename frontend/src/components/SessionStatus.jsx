import React from 'react';
import LoginButton from './LoginButton';

// Warning icon
function WarningIcon() {
  return (
    <svg className="w-8 h-8 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

export default function SessionStatus({ sessionExpired, error, onRelogin }) {
  if (!sessionExpired && !error) return null;

  return (
    <div
      role="alert"
      className="w-full max-w-sm bg-orange-950/80 border border-orange-500/50 rounded-2xl p-6 flex flex-col items-center gap-5 shadow-2xl shadow-orange-900/30 backdrop-blur-sm animate-pulse-fast"
      style={{ animationIterationCount: 3 }}
    >
      <div className="flex items-center gap-3 text-center">
        <WarningIcon />
        <div>
          <h3 className="text-orange-300 font-bold text-lg leading-tight">
            Sessão expirada!
          </h3>
          <p className="text-orange-400/80 text-sm mt-0.5">
            Sua sessão bugou ou expirou. Clique para re-logar.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-950/50 px-3 py-2 rounded-lg w-full text-center">
          {error}
        </p>
      )}

      <LoginButton
        onLogin={onRelogin}
        label="Re-logar com GitHub"
        variant="relogin"
      />
    </div>
  );
}
