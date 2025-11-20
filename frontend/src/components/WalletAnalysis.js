import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, Loader2, TrendingUp, Calendar, Activity, Code, Network } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { apiService } from '../services/apiService';

export const WalletAnalysis = () => {
    const { publicKey } = useWallet();
    const [walletAddress, setWalletAddress] = useState('');
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeWallet = async (address) => {
        if (!address) {
            toast.error('Please enter a wallet address');
            return;
        }

        setLoading(true);
        try {
            const data = await apiService.analyzeWallet(address);
            setWalletData(data);
            
            if (apiService.isUsingMockData()) {
                toast.success('Wallet analyzed! (Demo data)', {
                    description: 'Using simulated data in demo mode'
                });
            } else {
                toast.success('Wallet analyzed successfully!');
            }
        } catch (error) {
            console.error('Error analyzing wallet:', error);
            toast.error('Failed to analyze wallet');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeConnected = () => {
        if (publicKey) {
            const address = publicKey.toString();
            setWalletAddress(address);
            analyzeWallet(address);
        } else {
            toast.error('Please connect your wallet first');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 750) return 'text-green-600';
        if (score >= 500) return 'text-blue-600';
        if (score >= 250) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score) => {
        if (score >= 750) return 'Excellent';
        if (score >= 500) return 'Good';
        if (score >= 250) return 'Fair';
        return 'Low';
    };

    return (
        <div className="space-y-6" data-testid="wallet-analysis">
            {/* Search Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Analyze Wallet Reputation</CardTitle>
                    <CardDescription>Enter a Solana wallet address or connect your wallet to analyze</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            data-testid="wallet-address-input"
                            placeholder="Enter Solana wallet address..."
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            data-testid="analyze-button"
                            onClick={() => analyzeWallet(walletAddress)}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                            <span className="ml-2">Analyze</span>
                        </Button>
                    </div>
                    {publicKey && (
                        <Button
                            data-testid="analyze-connected-button"
                            variant="outline"
                            onClick={handleAnalyzeConnected}
                            disabled={loading}
                            className="w-full"
                        >
                            Analyze My Connected Wallet
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Results Section */}
            {walletData && (
                <div className="space-y-4">
                    {/* Reputation Score */}
                    <Card data-testid="reputation-score-card">
                        <CardHeader>
                            <CardTitle>Reputation Score</CardTitle>
                            <CardDescription className="font-mono text-xs">{walletData.wallet_address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className={`text-6xl font-bold ${getScoreColor(walletData.reputation_score)}`}>
                                        {walletData.reputation_score}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-2">
                                        {getScoreLabel(walletData.reputation_score)} • Out of 1000
                                    </div>
                                </div>
                                <div className="h-32 w-32 rounded-full border-8 flex items-center justify-center" style={{
                                    borderColor: walletData.reputation_score >= 750 ? '#16a34a' :
                                        walletData.reputation_score >= 500 ? '#3b82f6' :
                                        walletData.reputation_score >= 250 ? '#eab308' : '#dc2626'
                                }}>
                                    <TrendingUp className="h-12 w-12" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card data-testid="metric-transactions">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{walletData.metrics.transaction_count}</div>
                                <p className="text-xs text-muted-foreground">Total on-chain transactions</p>
                            </CardContent>
                        </Card>

                        <Card data-testid="metric-volume">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Volume</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{walletData.metrics.total_volume} SOL</div>
                                <p className="text-xs text-muted-foreground">Total transaction volume</p>
                            </CardContent>
                        </Card>

                        <Card data-testid="metric-age">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Wallet Age</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{walletData.metrics.wallet_age_days}</div>
                                <p className="text-xs text-muted-foreground">Days since first transaction</p>
                            </CardContent>
                        </Card>

                        <Card data-testid="metric-contracts">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Contract Interactions</CardTitle>
                                <Code className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{walletData.metrics.contract_interactions}</div>
                                <p className="text-xs text-muted-foreground">Smart contract calls</p>
                            </CardContent>
                        </Card>

                        <Card data-testid="metric-frequency">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Activity Frequency</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{walletData.metrics.activity_frequency}</div>
                                <p className="text-xs text-muted-foreground">Transactions per day</p>
                            </CardContent>
                        </Card>

                        <Card data-testid="metric-programs">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unique Programs</CardTitle>
                                <Network className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{walletData.metrics.unique_programs}</div>
                                <p className="text-xs text-muted-foreground">Different programs used</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};