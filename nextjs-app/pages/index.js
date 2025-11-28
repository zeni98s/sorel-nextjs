import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Dashboard } from '../components/Dashboard';
import { WalletAnalysis } from '../components/WalletAnalysis';
import { Leaderboard } from '../components/Leaderboard';
import { DemoBanner } from '../components/DemoBanner';
import { AIChat } from '../components/AIChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart3, Search, Trophy } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <div className="App" data-testid="app-container">
      {/* Demo Mode Banner */}
      <DemoBanner />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="logo-container">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" fill="url(#gradient)" />
                  <path d="M20 10L25 20L20 30L15 20L20 10Z" fill="white" opacity="0.9" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#9945FF" />
                      <stop offset="100%" stopColor="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text" data-testid="app-title">
                  SoReL
                </h1>
                <p className="text-xs text-muted-foreground">Solana Reputation Layer</p>
              </div>
            </div>
            <div data-testid="wallet-button-container">
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8" data-testid="tabs-list">
            <TabsTrigger value="analysis" data-testid="tab-analysis">
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" data-testid="tab-content-analysis">
            <WalletAnalysis />
          </TabsContent>

          <TabsContent value="dashboard" data-testid="tab-content-dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="leaderboard" data-testid="tab-content-leaderboard">
            <Leaderboard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>SoReL • Data & Trust Layer for Solana Ecosystem</p>
            <p className="mt-2">Building reputation and trust on-chain • Powered by AI</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <AIChat walletAddress={activeTab === 'analysis' ? '' : null} />
    </div>
  );
}
