import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface BottomAppBarProps {
  onNavigate: (target: string) => void;
  isVisible: boolean;
}

const NAV_ITEMS = [
  { id: 'PASSPORT', icon: 'fa-id-card', label: 'Passport' },
  { id: 'BLACK_BOX', icon: 'fa-box-open', label: 'Black Box' },
  { id: 'GAP', icon: 'fa-exclamation-triangle', label: 'Gap Forum' },
  { id: 'EXAMINATION', icon: 'fa-terminal', label: 'Terminal' },
  { id: 'HUB', icon: 'fa-th-large', label: 'Hub' },
];

export const BottomAppBar: React.FC<BottomAppBarProps> = ({ onNavigate, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const SWIPE_THRESHOLD = 50;

    if (deltaY > SWIPE_THRESHOLD) {
      setIsOpen(true);
    } else if (deltaY < -SWIPE_THRESHOLD) {
      setIsOpen(false);
    }
    touchStartY.current = null;
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[680px] z-[60] pointer-events-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Drawer Handle / Multi-Chevron Arrows */}
      <div 
        className={`mx-auto w-20 h-10 flex flex-col items-center justify-end pb-1 cursor-pointer pointer-events-auto transition-all duration-500 transform ${isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-col items-center justify-center -space-y-2">
            <i className="fas fa-chevron-up text-xs text-yellow-500 animate-bounce" style={{ animationDelay: '0s' }}></i>
            <i className="fas fa-chevron-up text-xs text-yellow-500 animate-bounce" style={{ animationDelay: '0.1s' }}></i>
            <i className="fas fa-chevron-up text-xs text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }}></i>
        </div>
      </div>

      {/* The Actual Bar */}
      <div 
        className={`w-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto
                    ${isOpen ? 'translate-y-0' : 'translate-y-full'}
                    ${isDarkMode ? 'bg-zinc-950/95 border-t border-zinc-800' : 'bg-white/95 border-t border-zinc-200'}
                    backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)] px-6 pb-8 pt-4`}
      >
        {/* Top Handle for dragging down */}
        <div 
          className="w-12 h-1 bg-zinc-700/50 rounded-full mx-auto mb-6 cursor-pointer hover:bg-yellow-500/50 transition-colors"
          onClick={() => setIsOpen(false)}
        ></div>

        <div className="flex justify-between items-center">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className="flex flex-col items-center gap-2 group outline-none"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                              ${isDarkMode ? 'bg-zinc-900 group-hover:bg-yellow-500' : 'bg-zinc-100 group-hover:bg-blue-600'}
                              border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} shadow-md group-active:scale-90`}>
                <i className={`fas ${item.icon} text-lg transition-colors 
                                ${isDarkMode ? 'text-zinc-500 group-hover:text-black' : 'text-zinc-400 group-hover:text-white'}`}></i>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors
                               ${isDarkMode ? 'text-zinc-500 group-hover:text-yellow-500' : 'text-zinc-400 group-hover:text-blue-600'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Overlay to catch clicks outside when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10 bg-black/20 pointer-events-auto h-[200vh] -translate-y-1/2"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};