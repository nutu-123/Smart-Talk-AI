import { apiClient } from './api';

export const authService = {
  signup: async (authData) => {
    const response = await apiClient.post('/auth/signup', authData);
    return response.json();
  },
  
  signin: async (authData) => {
    const response = await apiClient.post('/auth/signin', authData);
    return response.json();
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};