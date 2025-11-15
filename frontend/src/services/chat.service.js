import { apiClient } from './api';
import { authService } from './auth.service';

export const chatService = {
  createSession: async () => {
    const token = authService.getToken();
    return apiClient.post('/chat/session', {}, token);
  },
  
  getSessions: async () => {
    const token = authService.getToken();
    return apiClient.get('/chat/sessions', token);
  },
  
  getMessages: async (sessionId) => {
    const token = authService.getToken();
    return apiClient.get(`/chat/messages/${sessionId}`, token);
  },
  
  deleteSession: async (sessionId) => {
    const token = authService.getToken();
    return apiClient.delete(`/chat/session/${sessionId}`, token);
  },
  
  updateSessionTitle: async (sessionId, title) => {
    const token = authService.getToken();
    return apiClient.patch(`/chat/session/${sessionId}/title`, { title }, token);
  },
  
  clearChat: async (sessionId) => {
    const token = authService.getToken();
    const response = await apiClient.post('/chat/clear', { sessionId }, token);
    return response.json();
  },
  
  getSuggestedPrompts: async () => {
    return apiClient.get('/prompts/suggested');
  }
};