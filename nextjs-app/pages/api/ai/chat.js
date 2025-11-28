import { generateChatResponse } from '../../../lib/ai';
import { getCollection } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, wallet_address } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    let context = {};

    // If wallet address provided, get context
    if (wallet_address) {
      const walletsCollection = await getCollection('wallets');
      const walletData = await walletsCollection.findOne(
        { wallet_address },
        { projection: { _id: 0 } }
      );
      if (walletData) {
        context.walletData = walletData;
      }
    }

    // Generate response
    const response = await generateChatResponse(message, context);

    // Save conversation to database (optional)
    const conversationsCollection = await getCollection('ai_conversations');
    await conversationsCollection.insertOne({
      message,
      response,
      wallet_address: wallet_address || null,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
}
