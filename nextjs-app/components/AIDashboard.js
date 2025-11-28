import { AIInsights } from './AIInsights';
import { AIRiskAssessment } from './AIRiskAssessment';

export const AIDashboard = ({ walletAddress, walletData }) => {
  return (
    <div className="space-y-6" data-testid="ai-dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <AIInsights walletAddress={walletAddress} walletData={walletData} />
        
        {/* Risk Assessment */}
        <AIRiskAssessment walletAddress={walletAddress} />
      </div>
    </div>
  );
};
