import { getCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const historyCollection = await getCollection('reputation_history');
    
    const trends = await historyCollection
      .aggregate([
        {
          $match: {
            timestamp: { $gte: startDate.toISOString() }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: { $toDate: '$timestamp' }
              }
            },
            average_score: { $avg: '$score' },
            wallet_count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
      .toArray();

    const formattedTrends = trends.map(trend => ({
      date: trend._id,
      average_score: parseFloat(trend.average_score.toFixed(2)),
      wallet_count: trend.wallet_count
    }));

    res.status(200).json(formattedTrends);
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: error.message });
  }
}
