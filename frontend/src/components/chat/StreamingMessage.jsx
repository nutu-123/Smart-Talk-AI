import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export default function StreamingMessage({ content }) {
  const { darkMode } = useTheme();

  return (
    <div className="flex gap-4 animate-fadeIn">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
      </div>
      <div className="flex-1">
        <span className={`text-sm font-bold block mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Smart Talk AI
        </span>
        <p className={`whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {content}
          <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse"></span>
        </p>
      </div>
    </div>
  );
}