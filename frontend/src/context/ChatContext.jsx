import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      currentSessionId,
      setCurrentSessionId,
      chatSessions,
      setChatSessions,
      isLoading,
      setIsLoading,
      streamingMessage,
      setStreamingMessage,
      addMessage,
      clearMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};