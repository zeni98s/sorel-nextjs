import { getCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const walletsCollection = await getCollection('wallets');

    // Total wallets
    const total_wallets_analyzed = await walletsCollection.countDocuments();

    // Calculate average reputation and total transactions
    const aggregateResult = await walletsCollection
      .aggregate([
        {
          $group: {
            _id: null,
            avg_reputation: { $avg: '$reputation_score' },
            total_transactions: { $sum: '$metrics.transaction_count' }
          }
        }
      ])
      .toArray();

    const avg_reputation = aggregateResult.length > 0 ? aggregateResult[0].avg_reputation : 0;
    const total_transactions = aggregateResult.length > 0 ? aggregateResult[0].total_transactions : 0;

    // Active wallets in last 24h
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const active_wallets_24h = await walletsCollection.countDocuments({
      last_analyzed: { $gte: yesterday.toISOString() }
    });

    res.status(200).json({
      total_wallets_analyzed,
      average_reputation: parseFloat(avg_reputation.toFixed(2)),
      total_transactions,
      active_wallets_24h
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    res.status(500).json({ error: error.message });
  }
}
