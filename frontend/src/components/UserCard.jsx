import React from 'react';

export default function UserCard({ user, onLogout }) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm shadow-2xl">
      {/* Avatar */}
      <div className="relative">
        <img
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          className="w-24 h-24 rounded-full ring-4 ring-green-500/50 shadow-lg"
        />
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" title="Sessão ativa" />
      </div>

      {/* User info */}
      <div className="text-center">
        <h2 className="text-white text-2xl font-bold">{user.name || user.login}</h2>
        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-gray-400 hover:text-green-400 transition-colors text-sm mt-1 block"
        >
          @{user.login}
        </a>
        {user.bio && (
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">{user.bio}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-center">
        <div>
          <p className="text-white font-bold text-lg">{user.public_repos ?? '—'}</p>
          <p className="text-gray-500 text-xs uppercase tracking-wide">Repos</p>
        </div>
        <div className="w-px bg-gray-700" />
        <div>
          <p className="text-white font-bold text-lg">{user.followers ?? '—'}</p>
          <p className="text-gray-500 text-xs uppercase tracking-wide">Seguidores</p>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="mt-2 w-full py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        Sair
      </button>
    </div>
  );
}
