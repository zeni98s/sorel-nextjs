import { generateWalletReport } from '../../../lib/ai';
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

    // Generate comprehensive report
    const report = await generateWalletReport(walletData);

    // Save to database
    await walletsCollection.updateOne(
      { wallet_address },
      { $set: { ai_report: report, report_generated_at: new Date().toISOString() } }
    );

    res.status(200).json({
      wallet_address,
      report,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: error.message });
  }
}
