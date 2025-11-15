import React, { useState, useEffect } from 'react';
import { Plus, Settings as SettingsIcon, Trash2, Download } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useChat } from '../../hooks/useChat';
import { chatService } from '../../services/chat.service';
import { exportChatToFile } from '../../utils/helpers';
import ChatHistory from './ChatHistory';
import Settings from './Settings';
import UserProfile from './UserProfile';

export default function Sidebar({ isOpen }) {
  const { darkMode } = useTheme();
  const { 
    messages, 
    setMessages, 
    currentSessionId, 
    setCurrentSessionId,
    setChatSessions 
  } = useChat();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadChatSessions();
    }
  }, [isOpen]);

  const loadChatSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setChatSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await chatService.createSession();
      const data = await response.json();
      setCurrentSessionId(data.sessionId);
      setMessages([]);
      loadChatSessions();
      return data.sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  };

  const loadSessionMessages = async (sessionId) => {
    try {
      const data = await chatService.getMessages(sessionId);
      setMessages(data.messages || []);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const clearCurrentChat = async () => {
    if (!currentSessionId) return;
    if (!window.confirm('Clear all messages?')) return;

    try {
      await chatService.clearChat(currentSessionId);
      setMessages([]);
      loadChatSessions();
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  const exportChat = () => {
    exportChatToFile(messages);
  };

  return (
    <div className={`${isOpen ? 'w-72' : 'w-0'} transition-all duration-300 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} border-r flex flex-col overflow-hidden`}>
      <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <button
          onClick={createNewChat}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-900'} font-medium transition-colors`}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <ChatHistory 
        onSelectSession={loadSessionMessages}
        onCreateNew={createNewChat}
      />

      <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} space-y-2`}>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>

        <Settings show={showSettings} />

        <button
          onClick={clearCurrentChat}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">Clear Chat</span>
        </button>

        <button
          onClick={exportChat}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Export Chat</span>
        </button>

        <UserProfile />
      </div>
    </div>
  );
}