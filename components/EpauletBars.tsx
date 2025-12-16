import React from 'react';

interface EpauletBarsProps {
  count: number;
  size?: 'small' | 'medium' | 'large' | 'xl';
  orientation?: 'vertical' | 'horizontal'; // In aviation, bars are horizontal stripes on a vertical shoulder loop, but request asked for "vertical bars".
  className?: string;
  animated?: boolean;
}

export const EpauletBars: React.FC<EpauletBarsProps> = ({ 
  count, 
  size = 'medium', 
  orientation = 'vertical',
  className = '',
  animated = false
}) => {
  // Determine dimensions based on size
  const barWidth = 
    size === 'small' ? 'w-1' : 
    size === 'medium' ? 'w-3' : 
    size === 'large' ? 'w-4' : 'w-14'; // XL width increased significantly for thickness
    
  const barHeight = 
    size === 'small' ? 'h-4' : 
    size === 'medium' ? 'h-16' : 
    size === 'large' ? 'h-24' : 'h-40'; // XL height increased for solid blocky look

  const spacing = size === 'small' ? 'gap-0.5' : size === 'xl' ? 'gap-6' : 'gap-2'; 

  const bars = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-row' : 'flex-col'} ${spacing} justify-center items-center ${className}`}>
      {bars.map((i) => (
        <div 
          key={i} 
          style={animated ? { animationDelay: `${i * 0.5}s` } : {}} 
          className={`
            ${orientation === 'vertical' ? barWidth : 'w-full h-1'} 
            ${orientation === 'vertical' ? barHeight : ''} 
            bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-700
            epaulet-bar rounded-sm border border-yellow-600/30
            ${animated ? 'bar-anim' : ''}
          `}
        />
      ))}
    </div>
  );
};