import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { EpauletBars } from './EpauletBars';

interface LoadingScreenProps {
  showBars?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ showBars = false }) => {
  const { config } = useConfig();
  // Using the exact logo URL provided by the user for the startup sequence
  const STARTUP_LOGO = "https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR";

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center space-y-8"
      style={{ animation: 'startup-fade-in 1s ease-out forwards' }}
    >
      <div className="relative">
        <img 
            src={STARTUP_LOGO} 
            alt="WingMentor Startup Logo" 
            className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10" 
            style={{ animation: 'logo-glow-pulse 3s infinite ease-in-out' }}
        />
        {/* Glow effect behind logo */}
        <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
      </div>

      <div className={`flex flex-col items-center space-y-6 transition-all duration-1000 ${showBars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {showBars && (
          <>
            <EpauletBars count={4} size="large" animated={true} />
            
            <div className="text-center">
                <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.4em] animate-pulse">
                    Initializing Flight Systems
                </p>
                <div className="mt-2 flex justify-center space-x-1">
                    <div className="w-1 h-1 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1 h-1 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};