import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function Settings({ show }) {
  const { darkMode, toggleTheme } = useTheme();

  if (!show) return null;

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} space-y-3`}>
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'} hover:scale-105 transition-transform`}
      >
        {darkMode ? (
          <>
            <Sun className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Dark Mode</span>
          </>
        )}
      </button>

      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-white border-gray-300'} border`}>
        <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>AI Providers</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Gemini</span>
            <span className="text-green-500">●</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>OpenAI</span>
            <span className="text-green-500">●</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Cohere</span>
            <span className="text-green-500">●</span>
          </div>
        </div>
      </div>
    </div>
  );
}