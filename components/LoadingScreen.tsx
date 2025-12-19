import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { EpauletBars } from './EpauletBars';

interface LoadingScreenProps {
  showBars?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ showBars = false }) => {
  const { config } = useConfig();
  // Logo URL for the startup sequence
  const STARTUP_LOGO = "https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR";

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ animation: 'startup-fade-in 1.2s ease-out forwards' }}
    >
      <div className="relative mb-16 flex flex-col items-center">
        <div className="relative z-10">
          <img 
              src={STARTUP_LOGO} 
              alt="WingMentor Startup Logo" 
              className="w-[280px] md:w-[540px] h-auto object-contain transition-all duration-1000" 
              style={{ animation: 'logo-glow-pulse 4s infinite ease-in-out' }}
          />
        </div>
        {/* Ambient Glow effect behind logo */}
        <div className="absolute inset-0 bg-yellow-500/10 blur-[120px] rounded-full scale-150 animate-pulse"></div>
      </div>

      <div className={`flex flex-col items-center space-y-12 transition-all duration-1000 ${showBars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {showBars && (
          <>
            <div className="scale-90 md:scale-110">
                <EpauletBars count={4} size="xl" animated={true} />
            </div>
            
            <div className="text-center px-6">
                <p className="text-yellow-600 font-mono text-[10px] md:text-base uppercase tracking-[0.6em] animate-pulse font-black">
                    Establishing Satellite Uplink
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
          </>
        )}
      </div>
      
      <div className="absolute bottom-10 font-mono text-[8px] text-zinc-800 tracking-[0.5em] uppercase">
        Version 2.4.0 Alpha
      </div>
    </div>
  );
};