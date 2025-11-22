export const REPUTATION_WEIGHTS = {
  transaction_volume: 0.30,
  transaction_frequency: 0.25,
  wallet_age: 0.15,
  contract_interactions: 0.20,
  network_participation: 0.10
};

export const MAX_SCORE = 1000;

export function calculateReputationScore(metrics) {
  // Transaction volume score (0-300 points)
  const volumeScore = Math.min(metrics.total_volume / 100, 300);
  
  // Transaction frequency score (0-250 points)
  const frequencyScore = Math.min(metrics.activity_frequency * 50, 250);
  
  // Wallet age score (0-150 points)
  const ageScore = Math.min(metrics.wallet_age_days / 2, 150);
  
  // Contract interactions score (0-200 points)
  const contractScore = Math.min(metrics.contract_interactions * 2, 200);
  
  // Network participation score (0-100 points)
  const participationScore = Math.min(metrics.unique_programs * 10, 100);
  
  const totalScore = volumeScore + frequencyScore + ageScore + contractScore + participationScore;
  
  return Math.min(Math.round(totalScore * 100) / 100, MAX_SCORE);
}

export function getScoreLabel(score) {
  if (score >= 750) return 'Excellent';
  if (score >= 500) return 'Good';
  if (score >= 250) return 'Fair';
  return 'Low';
}

export function getScoreColor(score) {
  if (score >= 750) return 'text-green-600';
  if (score >= 500) return 'text-blue-600';
  if (score >= 250) return 'text-yellow-600';
  return 'text-red-600';
}
