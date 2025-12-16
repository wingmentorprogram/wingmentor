import React from 'react';
import { useConfig } from '../context/ConfigContext';

export const LoadingScreen: React.FC = () => {
  const { config } = useConfig();
  const { images } = config;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      style={{ animation: 'startup-fade-in 1s ease-out forwards' }}
    >
      <img 
          src={images.LOGO} 
          alt="WingMentor Logo" 
          className="w-64 h-64 object-contain" 
          style={{ animation: 'logo-glow-pulse 3s infinite ease-in-out' }}
      />
    </div>
  );
};