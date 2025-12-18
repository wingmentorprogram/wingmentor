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
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
      style={{ animation: 'startup-fade-in 1s ease-out forwards' }}
    >
      <div className="relative mb-16">
        <img 
            src={STARTUP_LOGO} 
            alt="WingMentor Startup Logo" 
            className="w-[540px] h-auto object-contain relative z-10 transition-all duration-700" 
            style={{ animation: 'logo-glow-pulse 4s infinite ease-in-out' }}
        />
        {/* Intense Glow effect behind logo */}
        <div className="absolute inset-0 bg-yellow-500/10 blur-[150px] rounded-full scale-150 animate-pulse"></div>
      </div>

      <div className={`flex flex-col items-center space-y-12 transition-all duration-1000 ${showBars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        {showBars && (
          <>
            <div className="scale-110">
                <EpauletBars count={4} size="xl" animated={true} />
            </div>
            
            <div className="text-center">
                <p className="text-yellow-600 font-mono text-sm md:text-base uppercase tracking-[0.8em] animate-pulse font-black">
                    Initializing Flight Systems
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                    <div className="w-2.5 h-2.5 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2.5 h-2.5 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2.5 h-2.5 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};