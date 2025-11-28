import { useState } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Shield, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import axios from 'axios';

export const AIInsights = ({ walletAddress, walletData }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/ai/wallet-insights', {
        wallet_address: walletAddress
      });
      setInsights(response.data.insights);
      toast.success('AI insights generated!');
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  if (!insights && !loading) {
    return (
      <Card data-testid="ai-insights-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Wallet Insights
          </CardTitle>
          <CardDescription>
            Get AI-powered analysis of this wallet using open source models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateInsights} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate AI Insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-3 text-lg">AI analyzing wallet...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="ai-insights-result">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Summary</h4>
          <p className="text-sm text-purple-800">{insights?.summary}</p>
        </div>

        {/* Wallet Type */}
        {insights?.wallet_type && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {insights.wallet_type}
            </span>
          </div>
        )}

        {/* Strengths */}
        {insights?.strengths && insights.strengths.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {insights.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {insights?.improvements && insights.improvements.length > 0 && (
          <div>
            <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <ul className="space-y-1">
              {insights.improvements.map((improvement, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-amber-600 mr-2">→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Level */}
        {insights?.risk_level && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Risk Level:</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                insights.risk_level === 'Low' ? 'bg-green-100 text-green-800' :
                insights.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {insights.risk_level}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{insights.recommendation}</p>
          </div>
        )}

        {/* Confidence */}
        {insights?.confidence && (
          <div className="text-xs text-gray-500">
            AI Confidence: {Math.round(insights.confidence * 100)}%
          </div>
        )}

        {/* Regenerate Button */}
        <Button 
          onClick={generateInsights} 
          variant="outline" 
          className="w-full"
          disabled={loading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Regenerate Insights
        </Button>
      </CardContent>
    </Card>
  );
};