import React from 'react';
import { LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

export default function UserProfile() {
  const { darkMode } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
      </div>
      <button
        onClick={handleLogout}
        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}