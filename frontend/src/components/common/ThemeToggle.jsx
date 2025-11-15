import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-purple-100 hover:bg-purple-200'} backdrop-blur-sm transition-all duration-300 shadow-lg`}
    >
      {darkMode ? (
        <Sun className="w-6 h-6 text-yellow-300" />
      ) : (
        <Moon className="w-6 h-6 text-purple-700" />
      )}
    </button>
  );
}