import { getCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 50 } = req.query;
    const limitNum = parseInt(limit);

    const walletsCollection = await getCollection('wallets');
    const wallets = await walletsCollection
      .find({}, { projection: { _id: 0 } })
      .sort({ reputation_score: -1 })
      .limit(limitNum)
      .toArray();

    // Add ranks
    const walletsWithRank = wallets.map((wallet, index) => ({
      ...wallet,
      rank: index + 1
    }));

    res.status(200).json(walletsWithRank);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
}
