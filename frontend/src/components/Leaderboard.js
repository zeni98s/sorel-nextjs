import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { apiService } from '../services/apiService';

export const Leaderboard = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const data = await apiService.getLeaderboard(50);
            setWallets(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
        if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    };

    const truncateAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6" data-testid="leaderboard">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Top Wallets by Reputation
                    </CardTitle>
                    <CardDescription>The highest reputation scores on Solana</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {wallets.map((wallet) => (
                            <div
                                key={wallet.wallet_address}
                                data-testid={`leaderboard-item-${wallet.rank}`}
                                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 flex items-center justify-center">
                                        {getRankIcon(wallet.rank)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-mono text-sm font-medium">
                                            {truncateAddress(wallet.wallet_address)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {wallet.metrics.transaction_count} transactions • {wallet.metrics.wallet_age_days} days old
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {wallet.reputation_score}
                                    </div>
                                    <div className="text-xs text-muted-foreground">reputation</div>
                                </div>
                            </div>
                        ))}
                        {wallets.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                No wallets analyzed yet. Be the first!
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};