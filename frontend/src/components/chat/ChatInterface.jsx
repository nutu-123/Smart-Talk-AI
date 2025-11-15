import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { chatService } from '../../services/chat.service';
import { authService } from '../../services/auth.service';
import { API_URL } from '../../utils/constants';
import SuggestedPrompts from './SuggestedPrompts';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatInterface() {
  const { user } = useAuth();
  const { 
    messages, 
    setMessages, 
    currentSessionId, 
    setCurrentSessionId,
    isLoading, 
    setIsLoading,
    streamingMessage,
    setStreamingMessage,
    setChatSessions
  } = useChat();
  
  const [input, setInput] = useState('');
  const abortControllerRef = useRef(null);

  const createNewSession = async () => {
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

  const loadChatSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setChatSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      console.log('No session ID, creating new session...');
      sessionId = await createNewSession();
      if (!sessionId) {
        alert('Failed to create chat session. Please try again.');
        return;
      }
      setCurrentSessionId(sessionId);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('Sending message with session ID:', sessionId);

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    abortControllerRef.current = new AbortController();

    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput,
          sessionId: sessionId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullMessage += parsed.content;
                setStreamingMessage(fullMessage);
              }
            } catch (e) {}
          }
        }
      }

      if (fullMessage.trim()) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: fullMessage, 
          timestamp: new Date()
        }]);
      }
      setStreamingMessage('');
      loadChatSessions();

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Generation stopped by user');
      } else {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: '⚠️ Error connecting to AI. Please try again.', 
          timestamp: new Date(),
          isError: true
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (streamingMessage) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: streamingMessage + ' [Stopped by user]', 
        timestamp: new Date()
      }]);
    }
    
    setStreamingMessage('');
    setIsLoading(false);
  };

  const handlePromptSelect = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* FIXED: Added overflow-hidden and proper flex structure */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <SuggestedPrompts onSelectPrompt={handlePromptSelect} />
        ) : (
          <MessageList />
        )}
      </div>

      {/* Input stays at bottom */}
      <div className="flex-shrink-0">
        <MessageInput 
          input={input}
          setInput={setInput}
          onSend={handleSendMessage}
          onStop={stopGeneration}
        />
      </div>
    </div>
  );
}