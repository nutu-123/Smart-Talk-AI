import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function SignInForm({ authData, setAuthData, onSubmit, onKeyPress }) {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-4">
      <div className="relative">
        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="email"
          placeholder="Email *"
          value={authData.email}
          onChange={(e) => setAuthData({...authData, email: e.target.value})}
          onKeyPress={onKeyPress}
          className={`w-full pl-12 pr-4 py-3 rounded-xl ${darkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:border-purple-400 transition-all`}
        />
      </div>

      <div className="relative">
        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="password"
          placeholder="Password *"
          value={authData.password}
          onChange={(e) => setAuthData({...authData, password: e.target.value})}
          onKeyPress={onKeyPress}
          className={`w-full pl-12 pr-4 py-3 rounded-xl ${darkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:border-purple-400 transition-all`}
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-xl transition-all hover:scale-[1.02]"
      >
        Sign In
      </button>
    </div>
  );
}