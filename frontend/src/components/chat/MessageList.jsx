import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import StreamingMessage from './StreamingMessage';

export default function MessageList() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const { messages, streamingMessage } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  return (
    <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
      {messages.map((msg, i) => (
        <div key={i} className="flex gap-4 animate-fadeIn">
          {msg.role === 'assistant' ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 font-bold text-white shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {msg.role === 'user' ? user?.name : 'Smart Talk AI'}
              </span>
              {msg.provider && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  {msg.provider}
                </span>
              )}
            </div>
            <p className={`whitespace-pre-wrap leading-relaxed ${msg.isError ? 'text-red-500' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {msg.content}
            </p>
          </div>
        </div>
      ))}

      {streamingMessage && <StreamingMessage content={streamingMessage} />}

      <div ref={messagesEndRef} />
    </div>
  );
}