/**
 * API Service - Automatically switches between real backend and mock data
 */

import axios from 'axios';
import { mockApiService, shouldUseMockData } from './mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Unified API Service
 * Automatically uses mock data when backend is unavailable
 */
class ApiService {
  constructor() {
    this.useMock = shouldUseMockData();
    this.backendAvailable = null;
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth() {
    if (this.useMock) {
      return false;
    }

    try {
      const response = await axios.get(`${API}/`, { timeout: 3000 });
      this.backendAvailable = response.status === 200;
      return this.backendAvailable;
    } catch (error) {
      this.backendAvailable = false;
      return false;
    }
  }

  /**
   * Analyze wallet
   */
  async analyzeWallet(walletAddress) {
    // Try real backend first
    if (!this.useMock && this.backendAvailable !== false) {
      try {
        const response = await axios.post(`${API}/wallets/analyze`, {
          wallet_address: walletAddress
        }, { timeout: 10000 });
        return response.data;
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error.message);
        this.backendAvailable = false;
      }
    }

    // Fallback to mock data
    return await mockApiService.analyzeWallet(walletAddress);
  }

  /**
   * Get wallet details
   */
  async getWallet(walletAddress) {
    if (!this.useMock && this.backendAvailable !== false) {
      try {
        const response = await axios.get(`${API}/wallets/${walletAddress}`, { timeout: 5000 });
        return response.data;
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error.message);
        this.backendAvailable = false;
      }
    }

    return await mockApiService.getWallet(walletAddress);
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 50) {
    if (!this.useMock && this.backendAvailable !== false) {
      try {
        const response = await axios.get(`${API}/wallets/leaderboard/top?limit=${limit}`, { timeout: 5000 });
        return response.data;
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error.message);
        this.backendAvailable = false;
      }
    }

    return await mockApiService.getLeaderboard(limit);
  }

  /**
   * Get analytics stats
   */
  async getAnalyticsStats() {
    if (!this.useMock && this.backendAvailable !== false) {
      try {
        const response = await axios.get(`${API}/analytics/stats`, { timeout: 5000 });
        return response.data;
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error.message);
        this.backendAvailable = false;
      }
    }

    return await mockApiService.getAnalyticsStats();
  }

  /**
   * Get reputation trends
   */
  async getReputationTrends(days = 7) {
    if (!this.useMock && this.backendAvailable !== false) {
      try {
        const response = await axios.get(`${API}/analytics/trends?days=${days}`, { timeout: 5000 });
        return response.data;
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error.message);
        this.backendAvailable = false;
      }
    }

    return await mockApiService.getReputationTrends(days);
  }

  /**
   * Check if using mock data
   */
  isUsingMockData() {
    return this.useMock || this.backendAvailable === false;
  }
}

// Export singleton instance
export const apiService = new ApiService();
