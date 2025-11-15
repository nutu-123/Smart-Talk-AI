import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useChat } from '../../hooks/useChat';
import { chatService } from '../../services/chat.service';
import Header from '../common/Header';
import Sidebar from '../sidebar/Sidebar';
import ChatInterface from '../chat/ChatInterface';

export default function MainLayout() {
  const { darkMode } = useTheme();
  const { setCurrentSessionId, setMessages, setChatSessions } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await loadChatSessions();
    await createInitialSession();
  };

  const loadChatSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setChatSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const createInitialSession = async () => {
    try {
      const response = await chatService.createSession();
      const data = await response.json();
      setCurrentSessionId(data.sessionId);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create initial session:', error);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* FIXED: Added overflow-hidden to prevent page scroll */}
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* FIXED: Added overflow-hidden */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <ChatInterface />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}