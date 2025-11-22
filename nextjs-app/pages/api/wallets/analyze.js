import { getCollection } from '../../../lib/mongodb';
import { analyzeWallet } from '../../../lib/solana';
import { calculateReputationScore } from '../../../lib/reputation';
import { PublicKey } from '@solana/web3.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wallet_address } = req.body;

    // Validate wallet address
    if (!wallet_address || wallet_address.length < 32 || wallet_address.length > 44) {
      return res.status(400).json({ error: 'Invalid Solana wallet address format' });
    }

    try {
      new PublicKey(wallet_address);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid Solana wallet address' });
    }

    // Analyze wallet using Solana RPC
    const metrics = await analyzeWallet(wallet_address);

    // Calculate reputation score
    const reputation_score = calculateReputationScore(metrics);

    // Create wallet data
    const walletData = {
      id: Date.now().toString(),
      wallet_address,
      reputation_score,
      metrics,
      last_analyzed: new Date().toISOString(),
      rank: null
    };

    // Save to database
    const walletsCollection = await getCollection('wallets');
    await walletsCollection.updateOne(
      { wallet_address },
      { $set: walletData },
      { upsert: true }
    );

    // Save to history
    const historyCollection = await getCollection('reputation_history');
    await historyCollection.insertOne({
      wallet_address,
      score: reputation_score,
      timestamp: new Date().toISOString()
    });

    res.status(200).json(walletData);
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    res.status(500).json({ error: error.message });
  }
}
