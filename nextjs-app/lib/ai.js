/**
 * AI Service Layer using Open Source Models
 * Models: Llama 3, Mistral, Mixtral via Together.ai
 */

import Together from 'together-ai';

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY || 'demo-key'
});

// AI Model Configuration
const MODELS = {
  analysis: process.env.AI_MODEL_ANALYSIS || 'meta-llama/Llama-3-70b-chat-hf',
  chat: process.env.AI_MODEL_CHAT || 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  risk: process.env.AI_MODEL_RISK || 'meta-llama/Llama-3-8b-chat-hf'
};

/**
 * Generate AI completion using open source models
 */
export async function generateAICompletion(prompt, model = 'analysis', options = {}) {
  try {
    const response = await together.chat.completions.create({
      model: MODELS[model],
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.9,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('AI service unavailable');
  }
}

/**
 * Generate structured JSON response
 */
export async function generateStructuredResponse(prompt, model = 'analysis') {
  const fullPrompt = `${prompt}\n\nRespond ONLY with valid JSON. No other text.`;
  
  try {
    const response = await generateAICompletion(fullPrompt, model);
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON in response');
  } catch (error) {
    console.error('Structured response error:', error);
    // Return fallback
    return { error: 'Failed to generate structured response' };
  }
}

/**
 * AI Wallet Insights
 */
export async function generateWalletInsights(walletData) {
  const { wallet_address, reputation_score, metrics } = walletData;

  const prompt = `You are a blockchain analyst. Analyze this Solana wallet:

Wallet: ${wallet_address}
Reputation Score: ${reputation_score}/1000
Transactions: ${metrics.transaction_count}
Volume: ${metrics.total_volume} SOL
Wallet Age: ${metrics.wallet_age_days} days
Activity Frequency: ${metrics.activity_frequency} tx/day
Contract Interactions: ${metrics.contract_interactions}
Unique Programs: ${metrics.unique_programs}

Provide analysis in JSON format:
{
  "summary": "2-3 sentence overview",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "risk_level": "Low/Medium/High",
  "confidence": 0.85,
  "recommendation": "actionable recommendation",
  "wallet_type": "DeFi Trader/NFT Collector/HODLer/etc"
}`;

  return await generateStructuredResponse(prompt, 'analysis');
}

/**
 * AI Risk Assessment
 */
export async function assessWalletRisk(walletData, transactionHistory = []) {
  const { metrics, reputation_score } = walletData;

  const prompt = `Analyze wallet security risk:

Reputation: ${reputation_score}/1000
Transactions: ${metrics.transaction_count}
Volume: ${metrics.total_volume} SOL
Age: ${metrics.wallet_age_days} days
Activity: ${metrics.activity_frequency} tx/day

Assess for:
- Suspicious activity patterns
- Bot-like behavior
- Wash trading
- Rapid unusual transactions
- Volume manipulation

Return JSON:
{
  "risk_score": 0-100,
  "risk_level": "Low/Medium/High/Critical",
  "flags": ["flag1", "flag2"],
  "confidence": 0.85,
  "explanation": "detailed explanation",
  "recommendations": ["action1", "action2"]
}`;

  return await generateStructuredResponse(prompt, 'risk');
}

/**
 * Fraud Detection
 */
export async function detectFraud(walletData) {
  const { wallet_address, metrics, reputation_score } = walletData;

  const prompt = `Detect potential fraud or scam indicators:

Wallet: ${wallet_address}
Score: ${reputation_score}
Transactions: ${metrics.transaction_count}
Volume: ${metrics.total_volume} SOL
Age: ${metrics.wallet_age_days} days

Check for:
- Ponzi scheme patterns
- Pump and dump behavior
- Rug pull indicators
- Phishing activity
- Known scam patterns

Return JSON:
{
  "is_suspicious": true/false,
  "fraud_probability": 0-100,
  "fraud_types": ["type1", "type2"],
  "severity": "Low/Medium/High/Critical",
  "evidence": ["evidence1", "evidence2"],
  "action_required": "immediate action needed"
}`;

  return await generateStructuredResponse(prompt, 'risk');
}

/**
 * Predictive Scoring
 */
export async function predictReputationChange(walletData, historicalData = []) {
  const { reputation_score, metrics } = walletData;

  const prompt = `Predict future reputation score:

Current Score: ${reputation_score}/1000
Current Metrics:
- Transactions: ${metrics.transaction_count}
- Volume: ${metrics.total_volume} SOL
- Activity: ${metrics.activity_frequency} tx/day
- Age: ${metrics.wallet_age_days} days

Based on current trends, predict:

Return JSON:
{
  "current_score": ${reputation_score},
  "predicted_7d": predicted score in 7 days,
  "predicted_30d": predicted score in 30 days,
  "predicted_90d": predicted score in 90 days,
  "trend": "increasing/stable/decreasing",
  "confidence": 0.85,
  "factors": ["factor1", "factor2"],
  "reasoning": "explanation"
}`;

  return await generateStructuredResponse(prompt, 'analysis');
}

/**
 * Smart Recommendations
 */
export async function generateRecommendations(walletData) {
  const { reputation_score, metrics } = walletData;

  const prompt = `Generate personalized recommendations to improve wallet reputation:

Current Score: ${reputation_score}/1000
Transactions: ${metrics.transaction_count}
Activity: ${metrics.activity_frequency} tx/day
Age: ${metrics.wallet_age_days} days

Provide actionable steps:

Return JSON:
{
  "recommendations": [
    {
      "action": "specific action",
      "impact": "+50 points",
      "difficulty": "Easy/Medium/Hard",
      "timeframe": "1 week",
      "description": "detailed explanation"
    }
  ],
  "quick_wins": ["quick action 1", "quick action 2"],
  "long_term": ["long term strategy 1"],
  "estimated_improvement": "50-100 points in 30 days"
}`;

  return await generateStructuredResponse(prompt, 'analysis');
}

/**
 * Transaction Pattern Analysis
 */
export async function analyzeTransactionPatterns(walletData) {
  const { metrics } = walletData;

  const prompt = `Analyze transaction patterns and classify wallet behavior:

Metrics:
- Transactions: ${metrics.transaction_count}
- Volume: ${metrics.total_volume} SOL
- Frequency: ${metrics.activity_frequency} tx/day
- Contract Interactions: ${metrics.contract_interactions}
- Unique Programs: ${metrics.unique_programs}

Classify and analyze:

Return JSON:
{
  "wallet_type": "primary classification",
  "behavior_tags": ["tag1", "tag2", "tag3"],
  "activity_pattern": "description of activity pattern",
  "user_profile": "detailed profile",
  "similar_wallets": "characteristics of similar wallets",
  "unique_traits": ["trait1", "trait2"]
}`;

  return await generateStructuredResponse(prompt, 'analysis');
}

/**
 * AI Chatbot Response
 */
export async function generateChatResponse(userMessage, context = {}) {
  const contextInfo = context.walletData ? `
Context: Analyzing wallet with ${context.walletData.reputation_score}/1000 reputation score.
` : '';

  const prompt = `You are SoReL AI, an expert in Solana blockchain reputation and wallet analysis.
${contextInfo}
User Question: ${userMessage}

Provide a helpful, accurate, and friendly response. Be concise but informative.`;

  return await generateAICompletion(prompt, 'chat', { maxTokens: 500 });
}

/**
 * Generate Comprehensive Report
 */
export async function generateWalletReport(walletData) {
  const { wallet_address, reputation_score, metrics } = walletData;

  const prompt = `Generate a comprehensive wallet analysis report:

Wallet: ${wallet_address}
Reputation: ${reputation_score}/1000
Transactions: ${metrics.transaction_count}
Volume: ${metrics.total_volume} SOL
Age: ${metrics.wallet_age_days} days
Activity: ${metrics.activity_frequency} tx/day

Create a professional report with:
1. Executive Summary
2. Key Metrics Analysis
3. Strengths & Weaknesses
4. Risk Assessment
5. Recommendations
6. Peer Comparison
7. Future Outlook

Return JSON:
{
  "executive_summary": "3-4 sentences",
  "metrics_analysis": "detailed analysis",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "risk_assessment": "assessment",
  "recommendations": ["rec1", "rec2"],
  "peer_comparison": "how it compares",
  "future_outlook": "predictions",
  "overall_rating": "A/B/C/D/F"
}`;

  return await generateStructuredResponse(prompt, 'analysis');
}
