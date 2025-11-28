import { predictReputationChange } from '../../../lib/ai';
import { getCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wallet_address } = req.body;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const walletsCollection = await getCollection('wallets');
    const walletData = await walletsCollection.findOne(
      { wallet_address },
      { projection: { _id: 0 } }
    );

    if (!walletData) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Get historical data
    const historyCollection = await getCollection('reputation_history');
    const history = await historyCollection
      .find({ wallet_address })
      .sort({ timestamp: -1 })
      .limit(30)
      .toArray();

    // Generate predictions
    const predictions = await predictReputationChange(walletData, history);

    // Save to database
    await walletsCollection.updateOne(
      { wallet_address },
      { $set: { predictions, predictions_updated_at: new Date().toISOString() } }
    );

    res.status(200).json({
      wallet_address,
      predictions,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Predictions error:', error);
    res.status(500).json({ error: error.message });
  }
}
