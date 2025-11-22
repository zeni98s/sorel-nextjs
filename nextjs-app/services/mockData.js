/**
 * Mock Data Service for SoReL BETA Version
 * Simulates backend responses without requiring actual backend/blockchain
 */

// Mock wallet database
const mockWallets = [
  {
    id: "1",
    wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    reputation_score: 892,
    metrics: {
      transaction_count: 1247,
      total_volume: 45678.32,
      contract_interactions: 856,
      wallet_age_days: 234,
      activity_frequency: 5.33,
      unique_programs: 18
    },
    last_analyzed: new Date().toISOString(),
    rank: 1
  },
  {
    id: "2",
    wallet_address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    reputation_score: 784,
    metrics: {
      transaction_count: 892,
      total_volume: 32456.89,
      contract_interactions: 623,
      wallet_age_days: 189,
      activity_frequency: 4.72,
      unique_programs: 15
    },
    last_analyzed: new Date().toISOString(),
    rank: 2
  },
  {
    id: "3",
    wallet_address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
    reputation_score: 721,
    metrics: {
      transaction_count: 756,
      total_volume: 28934.56,
      contract_interactions: 534,
      wallet_age_days: 167,
      activity_frequency: 4.53,
      unique_programs: 14
    },
    last_analyzed: new Date().toISOString(),
    rank: 3
  },
  {
    id: "4",
    wallet_address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
    reputation_score: 678,
    metrics: {
      transaction_count: 634,
      total_volume: 24123.45,
      contract_interactions: 445,
      wallet_age_days: 145,
      activity_frequency: 4.37,
      unique_programs: 12
    },
    last_analyzed: new Date().toISOString(),
    rank: 4
  },
  {
    id: "5",
    wallet_address: "CuieVDEDtLo7FypA9SbLM9saXFdb1dsshEkyErMqkRQq",
    reputation_score: 645,
    metrics: {
      transaction_count: 589,
      total_volume: 21567.89,
      contract_interactions: 412,
      wallet_age_days: 134,
      activity_frequency: 4.39,
      unique_programs: 11
    },
    last_analyzed: new Date().toISOString(),
    rank: 5
  }
];

// Generate additional mock wallets for leaderboard
const generateMockWallets = (count) => {
  const wallets = [...mockWallets];
  
  for (let i = 6; i <= count; i++) {
    const score = Math.max(100, 650 - (i * 10) + Math.random() * 50);
    wallets.push({
      id: String(i),
      wallet_address: generateRandomAddress(),
      reputation_score: Math.round(score),
      metrics: {
        transaction_count: Math.round(600 - (i * 5) + Math.random() * 100),
        total_volume: Math.round((20000 - (i * 300) + Math.random() * 5000) * 100) / 100,
        contract_interactions: Math.round(400 - (i * 4) + Math.random() * 50),
        wallet_age_days: Math.round(120 - (i * 1.5) + Math.random() * 30),
        activity_frequency: Math.round((4.5 - (i * 0.05) + Math.random() * 0.5) * 100) / 100,
        unique_programs: Math.round(12 - (i * 0.1))
      },
      last_analyzed: new Date().toISOString(),
      rank: i
    });
  }
  
  return wallets;
};

// Generate random Solana address
const generateRandomAddress = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let address = '';
  for (let i = 0; i < 44; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
};

// Simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API Service
 */
export const mockApiService = {
  /**
   * Analyze a wallet address
   */
  async analyzeWallet(walletAddress) {
    await delay(1200); // Simulate network delay
    
    // Check if wallet exists in mock data
    const existing = mockWallets.find(w => w.wallet_address === walletAddress);
    if (existing) {
      return existing;
    }
    
    // Generate new mock wallet data
    const score = Math.round(300 + Math.random() * 500);
    const txCount = Math.round(100 + Math.random() * 900);
    
    return {
      id: String(Date.now()),
      wallet_address: walletAddress,
      reputation_score: score,
      metrics: {
        transaction_count: txCount,
        total_volume: Math.round((txCount * 0.5 + Math.random() * 10000) * 100) / 100,
        contract_interactions: Math.round(txCount * 0.6),
        wallet_age_days: Math.round(30 + Math.random() * 300),
        activity_frequency: Math.round((txCount / 100) * 100) / 100,
        unique_programs: Math.round(5 + Math.random() * 15)
      },
      last_analyzed: new Date().toISOString(),
      rank: null
    };
  },

  /**
   * Get wallet details
   */
  async getWallet(walletAddress) {
    await delay(500);
    
    const wallet = mockWallets.find(w => w.wallet_address === walletAddress);
    if (wallet) {
      return wallet;
    }
    
    throw new Error('Wallet not found');
  },

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 50) {
    await delay(600);
    
    const allWallets = generateMockWallets(limit);
    return allWallets.slice(0, limit);
  },

  /**
   * Get analytics stats
   */
  async getAnalyticsStats() {
    await delay(500);
    
    const totalWallets = 1247;
    const allWallets = generateMockWallets(100);
    const avgReputation = allWallets.reduce((sum, w) => sum + w.reputation_score, 0) / allWallets.length;
    const totalTransactions = allWallets.reduce((sum, w) => sum + w.metrics.transaction_count, 0);
    
    return {
      total_wallets_analyzed: totalWallets,
      average_reputation: Math.round(avgReputation * 100) / 100,
      total_transactions: totalTransactions,
      active_wallets_24h: Math.round(totalWallets * 0.23)
    };
  },

  /**
   * Get reputation trends
   */
  async getReputationTrends(days = 7) {
    await delay(500);
    
    const trends = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic trend data
      const baseScore = 520 + Math.sin(i / 2) * 80;
      const walletCount = 150 + Math.floor(Math.random() * 100);
      
      trends.push({
        date: date.toISOString().split('T')[0],
        average_score: Math.round(baseScore + Math.random() * 50),
        wallet_count: walletCount
      });
    }
    
    return trends;
  }
};

/**
 * Check if we should use mock data
 */
export const shouldUseMockData = () => {
  // Use mock data if:
  // 1. Demo mode is explicitly enabled
  // 2. Backend URL is not configured
  // 3. Backend is unreachable
  
  const demoMode = localStorage.getItem('sorel_demo_mode') === 'true';
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  
  return demoMode || !backendUrl || backendUrl.includes('localhost');
};

/**
 * Toggle demo mode
 */
export const toggleDemoMode = (enabled) => {
  localStorage.setItem('sorel_demo_mode', enabled ? 'true' : 'false');
  window.location.reload();
};

/**
 * Check if demo mode is active
 */
export const isDemoMode = () => {
  return localStorage.getItem('sorel_demo_mode') === 'true';
};
