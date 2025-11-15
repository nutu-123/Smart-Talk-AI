import React from 'react';
import { Send, Square } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useChat } from '../../hooks/useChat';

export default function MessageInput({ input, setInput, onSend, onStop }) {
  const { darkMode } = useTheme();
  const { isLoading } = useChat();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t p-4`}>
      {/* FIXED: This is now properly styled as fixed bottom section */}
      <div className="max-w-3xl mx-auto">
        <div className={`flex gap-4 p-4 rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border shadow-lg`}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Smart Talk AI anything..."
            disabled={isLoading}
            rows={1}
            className={`flex-1 bg-transparent border-none focus:outline-none resize-none ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} disabled:opacity-50`}
            style={{ minHeight: '24px', maxHeight: '200px' }}
          />
          {isLoading ? (
            <button
              onClick={onStop}
              className="w-12 h-12 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
              title="Stop generation"
            >
              <Square className="w-5 h-5 text-white fill-white" />
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!input.trim()}
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all hover:scale-105 flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        <p className={`text-xs text-center mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          Smart Talk AI uses multiple providers for best results. Always verify important information.
        </p>
      </div>
    </div>
  );
}