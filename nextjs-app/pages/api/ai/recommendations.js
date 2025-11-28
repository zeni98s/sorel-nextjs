import { generateRecommendations } from '../../../lib/ai';
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

    // Generate recommendations
    const recommendations = await generateRecommendations(walletData);

    // Save to database
    await walletsCollection.updateOne(
      { wallet_address },
      { $set: { recommendations, recommendations_updated_at: new Date().toISOString() } }
    );

    res.status(200).json({
      wallet_address,
      recommendations,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: error.message });
  }
}
