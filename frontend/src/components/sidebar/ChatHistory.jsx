import React, { useState } from 'react';
import { MessageSquare, Edit2, Trash2, Check, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useChat } from '../../hooks/useChat';
import { chatService } from '../../services/chat.service';
import { formatDate } from '../../utils/helpers';

export default function ChatHistory({ onSelectSession, onCreateNew }) {
  const { darkMode } = useTheme();
  const { chatSessions, currentSessionId, setChatSessions } = useChat();
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleDelete = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat?')) return;

    try {
      await chatService.deleteSession(sessionId);
      
      if (sessionId === currentSessionId) {
        await onCreateNew();
      }
      
      loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleUpdateTitle = async (sessionId) => {
    try {
      await chatService.updateSessionTitle(sessionId, editTitle);
      loadSessions();
      setEditingSessionId(null);
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setChatSessions(data.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      <div className={`px-3 py-2 text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>
        Chat History
      </div>
      {chatSessions.map((session) => (
        <div
          key={session.sessionId}
          onClick={() => onSelectSession(session.sessionId)}
          className={`group flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            session.sessionId === currentSessionId
              ? darkMode ? 'bg-gray-800 text-white' : 'bg-purple-50 text-purple-900'
              : darkMode ? 'hover:bg-gray-800/50 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-purple-500" />
          <div className="flex-1 min-w-0">
            {editingSessionId === session.sessionId ? (
              <div className="flex gap-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`flex-1 px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'} border`}
                  autoFocus
                />
                <button onClick={() => handleUpdateTitle(session.sessionId)}>
                  <Check className="w-4 h-4 text-green-500" />
                </button>
                <button onClick={() => setEditingSessionId(null)}>
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ) : (
              <>
                <p className={`text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {session.title}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formatDate(session.updatedAt)}
                </p>
              </>
            )}
          </div>
          <div className="hidden group-hover:flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingSessionId(session.sessionId);
                setEditTitle(session.title);
              }}
              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => handleDelete(session.sessionId, e)}
              className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <Trash2 className="w-3 h-3 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}