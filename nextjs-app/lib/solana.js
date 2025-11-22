import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = process.env.HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

let connection;

export function getConnection() {
  if (!connection) {
    connection = new Connection(RPC_URL, 'confirmed');
  }
  return connection;
}

export async function getWalletTransactions(walletAddress, limit = 100) {
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(walletAddress);
    
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit });
    return signatures;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function analyzeWallet(walletAddress) {
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(walletAddress);
    
    // Get transactions
    const transactions = await getWalletTransactions(walletAddress);
    const transactionCount = transactions.length;
    
    // Get balance
    const balance = await connection.getBalance(pubkey);
    const balanceSOL = balance / 1e9;
    
    // Estimate metrics
    const totalVolume = balanceSOL + (transactionCount * 0.1);
    
    // Calculate wallet age
    let walletAgeDays = 0;
    if (transactions.length > 0) {
      const oldestTx = transactions[transactions.length - 1];
      if (oldestTx.blockTime) {
        const ageSeconds = Date.now() / 1000 - oldestTx.blockTime;
        walletAgeDays = Math.floor(ageSeconds / 86400);
      }
    }
    
    const activityFrequency = walletAgeDays > 0 ? transactionCount / walletAgeDays : 0;
    const contractInteractions = Math.floor(transactionCount * 0.6);
    const uniquePrograms = Math.min(Math.floor(transactionCount * 0.3), 20);
    
    return {
      transaction_count: transactionCount,
      total_volume: parseFloat(totalVolume.toFixed(2)),
      contract_interactions: contractInteractions,
      wallet_age_days: walletAgeDays,
      activity_frequency: parseFloat(activityFrequency.toFixed(2)),
      unique_programs: uniquePrograms
    };
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    return {
      transaction_count: 0,
      total_volume: 0,
      contract_interactions: 0,
      wallet_age_days: 0,
      activity_frequency: 0,
      unique_programs: 0
    };
  }
}
