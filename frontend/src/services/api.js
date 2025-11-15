// Use relative URLs when in production (Docker)
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
    return '/api'; // Use nginx proxy
  }
  return 'http://localhost:5000/api';
};

const API_URL = getBaseURL();

export const apiClient = {
  get: async (endpoint, token = null) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    
    return response.json();
  },
  
  post: async (endpoint, data, token = null) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    return response;
  },
  
  patch: async (endpoint, data, token = null) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    
    return response.json();
  },
  
  delete: async (endpoint, token = null) => {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    
    return response.json();
  }
};