import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';

export const AIRiskAssessment = ({ walletAddress }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAssessment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/risk-assessment', {
        wallet_address: walletAddress
      });
      setAssessment(response.data.risk_assessment);
      toast.success('Risk assessment complete!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assess risk');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Low':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'Medium':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'High':
      case 'Critical':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low':
        return 'border-green-500 bg-green-50';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'High':
        return 'border-orange-500 bg-orange-50';
      case 'Critical':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <Card data-testid="ai-risk-assessment">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          AI Risk Assessment
        </CardTitle>
        <CardDescription>
          Advanced security analysis using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!assessment && !loading && (
          <Button onClick={runAssessment} className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Run Risk Assessment
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3">Analyzing security risks...</span>
          </div>
        )}

        {assessment && (
          <div className="space-y-4">
            {/* Risk Score */}
            <div className={`p-6 rounded-lg border-2 ${getRiskColor(assessment.risk_level)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getRiskIcon(assessment.risk_level)}
                  <div>
                    <div className="font-bold text-2xl">{assessment.risk_level} Risk</div>
                    <div className="text-sm text-gray-600">Risk Score: {assessment.risk_score}/100</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="font-semibold">{Math.round(assessment.confidence * 100)}%</div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            {assessment.explanation && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Analysis</h4>
                <p className="text-sm text-gray-700">{assessment.explanation}</p>
              </div>
            )}

            {/* Flags */}
            {assessment.flags && assessment.flags.length > 0 && (
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Risk Flags</h4>
                <div className="space-y-2">
                  {assessment.flags.map((flag, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {assessment.recommendations && assessment.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {assessment.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={runAssessment} variant="outline" className="w-full" disabled={loading}>
              Re-run Assessment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};