import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Info } from 'lucide-react';
import { isDemoMode, toggleDemoMode } from '../services/mockData';
import { apiService } from '../services/apiService';

export const DemoBanner = () => {
    const [isDemo, setIsDemo] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [backendStatus, setBackendStatus] = useState('checking');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        const demoMode = isDemoMode();
        const backendAvailable = await apiService.checkBackendHealth();
        
        setIsDemo(demoMode || !backendAvailable);
        setBackendStatus(backendAvailable ? 'available' : 'unavailable');
    };

    const handleToggleMode = () => {
        toggleDemoMode(!isDemo);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('sorel_banner_dismissed', 'true');
    };

    // Don't show if dismissed and backend is available
    if (!isVisible || (backendStatus === 'available' && !isDemo)) {
        return null;
    }

    return (
        <div className="relative" data-testid="demo-banner">
            {/* Beta/Demo Banner */}
            <div className={`${
                isDemo 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            } text-white py-3 px-4 shadow-md`}>
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isDemo ? (
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        ) : (
                            <Info className="h-5 w-5 flex-shrink-0" />
                        )}
                        
                        <div className="flex-1">
                            {isDemo ? (
                                <div>
                                    <span className="font-semibold">BETA Version - Demo Mode Active</span>
                                    <p className="text-sm opacity-90 mt-1">
                                        Using simulated data. No real blockchain transactions. 
                                        Perfect for testing and demonstrations.
                                    </p>
                                </div>
                            ) : backendStatus === 'checking' ? (
                                <span className="font-semibold">Connecting to backend...</span>
                            ) : (
                                <div>
                                    <span className="font-semibold">Backend Unavailable</span>
                                    <p className="text-sm opacity-90 mt-1">
                                        Using demo mode with simulated data. 
                                        Configure REACT_APP_BACKEND_URL to connect to real backend.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {backendStatus === 'unavailable' && (
                            <button
                                onClick={handleToggleMode}
                                className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                                data-testid="toggle-demo-mode"
                            >
                                {isDemo ? 'Try Backend' : 'Stay in Demo'}
                            </button>
                        )}
                        
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            data-testid="dismiss-banner"
                            aria-label="Dismiss banner"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Demo Mode Indicator (floating badge) */}
            {isDemo && (
                <div className="fixed bottom-4 right-4 z-50" data-testid="demo-indicator">
                    <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-semibold">DEMO MODE</span>
                    </div>
                </div>
            )}
        </div>
    );
};
