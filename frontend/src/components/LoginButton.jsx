import React from 'react';

// GitHub SVG icon
function GitHubIcon({ className = 'w-6 h-6' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.12 3.176.77.838 1.232 1.91 1.232 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function LoginButton({ onLogin, label = 'Login com GitHub', variant = 'primary' }) {
  const isRelogin = variant === 'relogin';

  return (
    <button
      onClick={onLogin}
      className={[
        'flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg',
        'transition-all duration-200 focus:outline-none focus:ring-4',
        isRelogin
          ? 'bg-orange-500 hover:bg-orange-400 text-white focus:ring-orange-500/40 shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40'
          : 'bg-white hover:bg-gray-100 text-gray-900 focus:ring-white/30 shadow-lg shadow-black/20',
      ].join(' ')}
    >
      <GitHubIcon className="w-6 h-6 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
}
