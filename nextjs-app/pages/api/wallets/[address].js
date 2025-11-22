import { getCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;

    const walletsCollection = await getCollection('wallets');
    const wallet = await walletsCollection.findOne(
      { wallet_address: address },
      { projection: { _id: 0 } }
    );

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ error: error.message });
  }
}
