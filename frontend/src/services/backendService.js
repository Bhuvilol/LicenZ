import axios from 'axios';
import { API_CONFIG } from '../config/api.js';

// Backend API base URL
const BACKEND_BASE_URL = API_CONFIG.BACKEND_URL || 'http://localhost:8080';

// Create axios instance for backend
const backendAPI = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Content Management API
export const contentAPI = {
  // Create new content
  async createContent(contentData) {
    const response = await backendAPI.post('/api/content', contentData);
    return response.data;
  },

  // Get all content
  async getAllContent(params = {}) {
    const response = await backendAPI.get('/api/content', { params });
    return response.data;
  },

  // Get content by wallet address
  async getContentByWallet(walletAddress) {
    const response = await backendAPI.get(`/api/content/wallet/${walletAddress}`);
    return response.data;
  },

  // Get content by user ID
  async getContentByUserId(userId) {
    const response = await backendAPI.get(`/api/content/user/${userId}`);
    return response.data;
  },

  // Get content by ID
  async getContentById(id) {
    const response = await backendAPI.get(`/api/content/${id}`);
    return response.data;
  },

  // Delete content
  async deleteContent(id) {
    const response = await backendAPI.delete(`/api/content/${id}`);
    return response.data;
  },

  // Download content directly from backend
  async downloadContent(id) {
    const response = await backendAPI.get(`/api/content/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Generation Tracking API
export const generationAPI = {
  // Track generation request
  async trackGeneration(generationData) {
    const response = await backendAPI.post('/api/generate', generationData);
    return response.data;
  },

  // Get generation history
  async getGenerationHistory() {
    const response = await backendAPI.get('/api/generate/history');
    return response.data;
  },

  // Get generation history by wallet address
  async getGenerationHistoryByWallet(walletAddress) {
    const response = await backendAPI.get(`/api/generate/history/${walletAddress}`);
    return response.data;
  }
};

// Health and Status API
export const systemAPI = {
  // Check backend health
  async checkHealth() {
    const response = await backendAPI.get('/api/health');
    return response.data;
  },

  // Get system status
  async getStatus() {
    const response = await backendAPI.get('/api/status');
    return response.data;
  }
};

// Test backend connectivity
export const testBackendConnection = async () => {
  try {
    const health = await systemAPI.checkHealth();
    return {
      isConnected: true,
      status: health.status,
      message: 'Backend is connected and healthy'
    };
  } catch (error) {
    return {
      isConnected: false,
      status: 'disconnected',
      message: error.message
    };
  }
};

export default {
  contentAPI,
  generationAPI,
  systemAPI,
  testBackendConnection
};
