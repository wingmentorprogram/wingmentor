import React, { useRef, useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { DeveloperConsole } from './DeveloperConsole';
import { useTheme } from '../context/ThemeContext'; 
import { RevealOnScroll } from './RevealOnScroll';
import { EpauletBars } from './EpauletBars';
import { MindMap } from './MindMap';
import { PilotsStory } from './PilotsStory';

interface LandingPageProps {
  isVideoWarm?: boolean;
  setIsVideoWarm?: (warm: boolean) => void;
  onGoToProgramDetail: () => void;
  onGoToGapPage: () => void; 
  onGoToOperatingHandbook: () => void;
  onGoToBlackBox: () => void;
  onGoToExaminationTerminal: () => void;
  scrollToSection?: string | null;
  onScrollComplete?: () => void;
  onGoToEnrollment: () => void;
}

const ACTION_ICONS = [
    { 
      icon: 'fa-book-open', 
      title: 'Operating Handbook', 
      description: 'Access the official Program Operating Handbook. Detailed protocols and program guidelines.', 
      target: 'handbook', 
      image: 'https://lh3.googleusercontent.com/d/1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN' 
    },
    { 
      icon: 'fa-terminal', 
      title: 'Examination Terminal', 
      description: 'Prepare for checkrides and knowledge tests with our interactive preparation hub.', 
      target: 'examination', 
      image: 'https://lh3.googleusercontent.com/d/11j7ZHv874EBZZ6O36etvuHC6rRWWm8kF' 
    },
    { 
      icon: 'fa-exclamation-triangle', 
      title: 'Pilot Gap Forum', 
      description: 'Discuss industry challenges with peers and mentors in our secure intelligence hub.', 
      target: 'gap',
      image: 'https://lh3.googleusercontent.com/d/1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp' 
    },
    { 
      icon: 'fa-box-open', 
      title: 'The Black Box', 
      description: 'Unlock deeply guarded information and resources from our comprehensive knowledge vault.', 
      target: 'blackbox', 
      image: 'https://lh3.googleusercontent.com/d/1yLM_bGVPN8Sa__fqR95C0EeA1CUsTAA7' 
    },
];

export const LandingPage: React.FC<LandingPageProps> = ({ 
    isVideoWarm = false, 
    setIsVideoWarm, 
    onGoToProgramDetail, 
    onGoToGapPage, 
    onGoToOperatingHandbook, 
    onGoToBlackBox, 
    onGoToExaminationTerminal, 
    scrollToSection, 
    onScrollComplete, 
    onGoToEnrollment 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { config } = useConfig();
  const { images } = config; 
  const { isDarkMode } = useTheme(); 
  
  const [isDevConsoleOpen, setDevConsoleOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(!isVideoWarm);
  const [loadingApp, setLoadingApp] = useState<string | null>(null);

  const appSuiteData = [
    {
        title: "WingMentor Passport",
        desc: "The central hub for your mentorship journey. Access your digital passport, track milestones, and manage your program progress from a single, intuitive interface.",
        image: images.WINGMENTOR_PASSPORT_APP_IMG,
    },
    {
        title: "Examination Terminal",
        desc: "A tactical preparation hub designed for mastery. Access simulated checkrides, comprehensive study reviewers, and performance analytics to turn weaknesses into strengths.",
        image: "https://lh3.googleusercontent.com/d/11j7ZHv874EBZZ6O36etvuHC6rRWWm8kF",
    },
    {
        title: "WingLogs",
        desc: "Your verifiable proof of experience. A professional digital logbook designed to meticulously document every consultation session, building a credible portfolio for your career.",
        image: images.LOGBOOK_IMG,
    },
    {
        title: "The Pilot Gap Forum",
        desc: "The intelligence hub for the modern aviator. Engage in critical discussions on industry trends, share strategic insights, and connect with peers and senior mentors.",
        image: images.PILOT_GAP_FORUM_APP_IMG,
    },
    {
        title: "The Black Box",
        desc: "The ultimate knowledge vault. Gain exclusive, members-only access to a comprehensive library of study materials, flight data, and career intelligence.",
        image: "https://lh3.googleusercontent.com/d/1yLM_bGVPN8Sa__fqR95C0EeA1CUsTAA7",
    },
    {
        title: "The Program Handbook",
        desc: "The definitive operational manual for your mentorship journey. Access mission-critical protocols, program guidelines, and real-life pilot scenarios.",
        image: "https://lh3.googleusercontent.com/d/1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN",
    }
  ];

  const [selectedActionIndex, setSelectedActionIndex] = useState(1); 
  const [selectedAppIndex, setSelectedAppIndex] = useState(2);       
  
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent, type: 'action' | 'app') => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX.current;
      const SWIPE_THRESHOLD = 50;
      
      if (type === 'action') {
          if (deltaX > SWIPE_THRESHOLD) {
              setSelectedActionIndex(prev => Math.max(0, prev - 1));
          } else if (deltaX < -SWIPE_THRESHOLD) {
              setSelectedActionIndex(prev => Math.min(ACTION_ICONS.length - 1, prev + 1));
          }
      } else {
          if (deltaX > SWIPE_THRESHOLD) {
              setSelectedAppIndex(prev => Math.max(0, prev - 1));
          } else if (deltaX < -SWIPE_THRESHOLD) {
              setSelectedAppIndex(prev => Math.min(appSuiteData.length - 1, prev + 1));
          }
      }
  };

  useEffect(() => {
    if (scrollToSection) {
      const element = document.getElementById(scrollToSection);
      if (element) {
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      if (onScrollComplete) {
        onScrollComplete();
      }
    }
  }, [scrollToSection, onScrollComplete]);

  useEffect(() => {
    const attemptPlay = async () => {
        if (!videoRef.current) return;
        try {
            await videoRef.current.play();
        } catch (error) {
            console.warn("Autoplay sound blocked:", error);
            setIsMuted(true);
            if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().catch(e => console.error("Muted autoplay failed", e));
            }
        }
    };
    if (!isLoading || isVideoWarm) {
        attemptPlay();
    }
  }, [isLoading, isVideoWarm]);

  const handleScrollClick = () => {
    const aboutSection = document.getElementById('about-program-overview-section');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLearnMoreApps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const appsSection = document.getElementById('pilot-apps-made-by-pilots-section');
    if (appsSection) appsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleIconClick = (target: string) => {
    setLoadingApp(target); 
    setTimeout(() => {
        setLoadingApp(null); 
        switch (target) {
            case 'handbook': onGoToOperatingHandbook(); break;
            case 'examination': onGoToExaminationTerminal(); break;
            case 'gap': onGoToGapPage(); break;
            case 'blackbox': onGoToBlackBox(); break;
        }
    }, 2000); 
  };

  return (
    <div className="relative pt-32 min-h-screen bg-white dark:bg-black flex flex-col animate-in fade-in duration-700 transition-colors">
      
      {loadingApp && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
            {(() => {
                const app = ACTION_ICONS.find(a => a.target === loadingApp);
                if (!app) return null;
                return (
                    <div className="flex flex-col items-center p-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full animate-pulse"></div>
                            <img 
                                src={app.image} 
                                alt={app.title} 
                                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl relative z-10 shadow-2xl border border-zinc-800"
                                style={{ animation: 'logo-glow-pulse 2s infinite ease-in-out' }}
                            />
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold brand-font text-white uppercase tracking-widest mb-2 text-center">
                            {app.title}
                        </h2>
                        <div className="flex items-center space-x-2 mt-4">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
                        </div>
                        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4 animate-pulse">
                            Initializing System...
                        </p>
                    </div>
                );
            })()}
        </div>
      )}

      <DeveloperConsole isOpen={isDevConsoleOpen} onClose={() => setDevConsoleOpen(false)} />

      <div className="relative z-10 flex flex-col items-center pb-8 px-4 pointer-events-none text-center space-y-2">
        <h2 className={`text-3xl md:text-6xl font-['Raleway'] font-extrabold uppercase tracking-[0.1em] drop-shadow-2xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Become a Wing Mentor
        </h2>
        <h2 className={`text-xl md:text-4xl font-['Raleway'] font-[200] uppercase tracking-widest drop-shadow-xl ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Bridging the experience gap <br />
            <div className="relative inline-block mt-2">
              <span className="inline-flex items-center gap-x-2 md:gap-x-4 align-middle relative z-10 px-2">
                  Low timer
                  <div className="vor-indicator text-yellow-500 font-black">
                    <div className="vor-flag">
                      <div className="vor-side vor-front">TO</div>
                      <div className="vor-side vor-hatch"></div>
                      <div className="vor-side vor-back">FR</div>
                    </div>
                  </div>
                  wing mentor
              </span>
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-yellow-500/20 pointer-events-none">
                 <img 
                    src={images.RUNWAY_HOLDING_POINT} 
                    className="animate-plane-underline h-8 w-8 -top-4 object-contain"
                    alt="Underline Plane" 
                    style={{ filter: 'brightness(1.5) drop-shadow(0 0 8px rgba(234,179,8,0.9))' }}
                 />
              </div>
            </div>
        </h2>
        <p className={`pt-4 text-[10px] md:text-sm tracking-wide uppercase opacity-80 dark:text-zinc-400 text-zinc-600`}>
            Welcome to Wing Mentor fellow pilot
        </p>
      </div>

      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden group flex flex-col border-y border-zinc-300 dark:border-zinc-900 bg-black">
        {isLoading && !isVideoWarm && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-yellow-500 rounded-full animate-spin"></div>
                    <span className="text-xs text-yellow-500 font-bold uppercase tracking-widest animate-pulse">
                        Loading Flight Data...
                    </span>
                </div>
            </div>
        )}

        <div className={`absolute inset-0 overflow-hidden bg-black flex items-center justify-center ${isMuted ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            <video 
                ref={videoRef}
                className="w-full h-full object-cover transition-opacity duration-1000"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                poster={images.HERO_POSTER}
                onWaiting={() => !isVideoWarm && setIsLoading(true)}
                onCanPlay={() => { setIsLoading(false); setIsVideoWarm?.(true); }}
                onPlaying={() => { setIsLoading(false); setIsVideoWarm?.(true); }}
                onLoadedData={() => { setIsLoading(false); setIsVideoWarm?.(true); }}
                src={images.HERO_VIDEO}
            >
                Your browser does not support the video tag.
            </video>
        </div>

        <div className="absolute bottom-10 right-10 z-30">
            <button 
                onClick={toggleMute}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-500 transition-all text-white hover:text-yellow-400 group shadow-lg"
            >
                <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-sm group-hover:scale-110 transition-transform`}></i>
                <span className="text-xs font-bold uppercase tracking-wider">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
        </div>
      </div>
      
      <div className="w-full py-16 md:py-24 bg-black border-b border-zinc-900 relative">
        <div 
            className="cursor-pointer flex flex-col items-center justify-center space-y-4 select-none mb-20" 
            onClick={handleScrollClick}
        >
            <div className="w-full flex flex-col items-center justify-center text-center">
                <span className="text-[14px] md:text-lg font-bold text-yellow-500 uppercase tracking-[0.15em]">
                    wingmentor apps for pilots made by pilots
                </span>
                <span className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] font-['Raleway'] mr-[-0.3em] mt-3">
                    Learn more about the program
                </span>
            </div>
            <div className="w-full flex justify-center pt-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="chevron-scroll"></div>
                    <div className="chevron-scroll"></div>
                    <div className="chevron-scroll"></div>
                </div>
            </div>
        </div>
        
        <div className="w-full flex flex-col items-center mb-16">
            <div className="w-full flex items-center justify-center h-[220px] relative">
                <div 
                  className="relative w-full max-w-4xl h-full flex justify-center items-center" 
                  style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={(e) => handleTouchEnd(e, 'action')}
                >
                    {ACTION_ICONS.map((feature, index) => {
                        const offset = index - selectedActionIndex;
                        const absOffset = Math.abs(offset);
                        const isActive = offset === 0;
                        let rotateY = offset < 0 ? 75 : offset > 0 ? -75 : 0;
                        const spacing = 30, centerGap = 100;
                        let translateX = isActive ? 0 : offset < 0 ? (offset * spacing) - centerGap : (offset * spacing) + centerGap;
                        const style: React.CSSProperties = {
                            position: 'absolute', width: '120px', height: '120px', left: '50%', top: '40%',
                            marginLeft: '-60px', marginTop: '-60px',
                            transform: `translateX(${translateX}px) translateZ(${isActive ? 0 : -200}px) rotateY(${rotateY}deg) scale(${isActive ? 1.2 : 0.7})`,
                            zIndex: 100 - absOffset, transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: `brightness(${isActive ? 1 : 0.15})`, opacity: isActive ? 1 : 0.6, cursor: 'pointer'
                        };
                        return (
                            <div key={feature.target} style={style} onClick={() => isActive ? handleIconClick(feature.target) : setSelectedActionIndex(index)}>
                                <div className="w-full h-full relative group">
                                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover rounded-xl shadow-2xl border border-zinc-800" style={{ WebkitBoxReflect: `below 4px linear-gradient(transparent, transparent 65%, rgba(0,0,0,0.3))` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center justify-center gap-6 z-50 mt-2">
                <button onClick={() => setSelectedActionIndex(prev => Math.max(0, prev - 1))} disabled={selectedActionIndex === 0} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'} disabled:opacity-30 hover:bg-yellow-500 hover:text-black shadow-lg`}>
                    <i className="fas fa-chevron-left text-[10px]"></i>
                </button>
                <div className="relative w-[180px] h-10 flex items-center justify-center overflow-hidden">
                    {ACTION_ICONS.map((feature, idx) => (
                        <div key={feature.target} className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 transform ${selectedActionIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                            <h3 className="text-[10px] md:text-xs font-bold brand-font uppercase tracking-[0.2em] text-white text-center">{feature.title}</h3>
                            <div className="w-6 h-0.5 bg-yellow-500 mt-1"></div>
                        </div>
                    ))}
                </div>
                <button onClick={() => setSelectedActionIndex(prev => Math.min(ACTION_ICONS.length - 1, prev + 1))} disabled={selectedActionIndex === ACTION_ICONS.length - 1} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'} disabled:opacity-30 hover:bg-yellow-500 hover:text-black shadow-lg`}>
                    <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
            </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
            <button onClick={handleLearnMoreApps} className="group px-8 py-3 bg-black border border-zinc-700 rounded-full flex items-center gap-3 transition-all hover:border-yellow-500/50 shadow-2xl backdrop-blur-md">
                <img src={images.RUNWAY_HOLDING_POINT} alt="Learn More" className="w-6 h-6 object-contain animate-bounce group-hover:scale-110 transition-transform" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-yellow-500">learn more about pilot apps</span>
            </button>
        </div>
      </div>

      <PilotsStory />

      <div id="pilot-apps-made-by-pilots-section" className="w-full py-24 bg-black border-y border-zinc-900 overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6 text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold brand-font text-white uppercase tracking-wider mb-4">Pilot Suite</h2>
              <p className="text-zinc-500 text-sm md:text-lg max-w-2xl mx-auto italic">Strategic digital tools engineered to bridge the operational gap between training and command.</p>
          </div>
          <div className="w-full flex justify-center h-[350px] relative items-center">
               <div className="relative w-full max-w-5xl h-full flex justify-center items-center" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }} onTouchStart={handleTouchStart} onTouchEnd={(e) => handleTouchEnd(e, 'app')}>
                   {appSuiteData.map((app, index) => {
                       const offset = index - selectedAppIndex;
                       const absOffset = Math.abs(offset);
                       const isActive = offset === 0;
                       let rotateY = offset < 0 ? 55 : offset > 0 ? -55 : 0;
                       const spacing = 120, centerGap = 150;
                       let translateX = isActive ? 0 : offset < 0 ? (offset * spacing) - centerGap : (offset * spacing) + centerGap;
                       return (
                           <div key={app.title} style={{ 
                               position: 'absolute', width: '220px', height: '140px', left: '50%', top: '50%',
                               marginLeft: '-110px', marginTop: '-70px',
                               transform: `translateX(${translateX}px) translateZ(${isActive ? 100 : -250}px) rotateY(${rotateY}deg) scale(${isActive ? 1.4 : 0.8})`,
                               zIndex: 100 - absOffset, transition: 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                               filter: `brightness(${isActive ? 1 : 0.2}) grayscale(${isActive ? 0 : 0.5})`, opacity: isActive ? 1 : 0.7, cursor: 'pointer'
                           }} onClick={() => setSelectedAppIndex(index)}>
                               <img src={app.image} alt={app.title} className="w-full h-full object-cover rounded-xl shadow-2xl border border-zinc-700" />
                               {isActive && (
                                   <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[300px] text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
                                       <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">{app.title}</h4>
                                       <p className="text-zinc-500 text-[9px] leading-snug">{app.desc}</p>
                                   </div>
                               )}
                           </div>
                       );
                   })}
               </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-24">
               <button onClick={() => setSelectedAppIndex(p => Math.max(0, p-1))} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-yellow-500 transition-all"><i className="fas fa-chevron-left"></i></button>
               <div className="flex gap-1">
                   {appSuiteData.map((_, i) => (
                       <div key={i} className={`h-1 rounded-full transition-all duration-300 ${selectedAppIndex === i ? 'w-8 bg-yellow-500' : 'w-2 bg-zinc-800'}`}></div>
                   ))}
               </div>
               <button onClick={() => setSelectedAppIndex(p => Math.min(appSuiteData.length-1, p+1))} className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-yellow-500 transition-all"><i className="fas fa-chevron-right"></i></button>
          </div>
      </div>

      <div id="how-we-fill-gap-section" className="w-full py-24 bg-black border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
              <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4 block">Strategic Architecture</span>
              <h2 className="text-3xl md:text-5xl font-bold brand-font text-white uppercase tracking-wider mb-6">Filing the Pilot Gap</h2>
              <p className="text-zinc-400 text-lg max-w-3xl mx-auto notam-font italic">Interactive Mindmap: A tactical layout of the career transition from student to master.</p>
          </div>
          <MindMap />
      </div>

      <footer className="w-full py-20 bg-zinc-950 border-t border-zinc-900 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6">
              <div className="flex flex-col items-center mb-12">
                  <img src={images.LOGO} alt="Wing Mentor" className="w-16 h-16 mb-4 filter brightness-0 invert opacity-50" />
                  <h4 className="brand-font text-2xl text-white uppercase tracking-widest">WingMentor</h4>
                  <p className="text-zinc-600 text-xs uppercase tracking-[0.3em] mt-2">Bridging the Experience Gap</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto text-left">
                  <div>
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Operations</h5>
                      <ul className="text-zinc-500 text-[10px] uppercase space-y-2 font-medium">
                          <li><button onClick={() => handleIconClick('handbook')} className="hover:text-yellow-500 transition-colors">Handbook</button></li>
                          <li><button onClick={onGoToProgramDetail} className="hover:text-yellow-500 transition-colors">Program</button></li>
                          <li><button onClick={onGoToEnrollment} className="hover:text-yellow-500 transition-colors">Enrollment</button></li>
                      </ul>
                  </div>
                  <div>
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Intelligence</h5>
                      <ul className="text-zinc-500 text-[10px] uppercase space-y-2 font-medium">
                          <li><button onClick={() => handleIconClick('blackbox')} className="hover:text-yellow-500 transition-colors">Black Box</button></li>
                          <li><button onClick={() => handleIconClick('gap')} className="hover:text-yellow-500 transition-colors">Forum</button></li>
                          <li><button onClick={() => handleIconClick('examination')} className="hover:text-yellow-500 transition-colors">Terminal</button></li>
                      </ul>
                  </div>
                  <div className="col-span-2">
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Contact HQ</h5>
                      <p className="text-zinc-500 text-[10px] uppercase mb-2">wingmentorprogram@gmail.com</p>
                      <div className="flex gap-4 mt-4">
                          <a href="#" className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-blue-500 transition-all"><i className="fab fa-facebook-f"></i></a>
                          <a href="#" className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-sky-400 transition-all"><i className="fab fa-twitter"></i></a>
                          <a href="#" className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-pink-500 transition-all"><i className="fab fa-instagram"></i></a>
                      </div>
                  </div>
              </div>
              <p className="text-zinc-800 text-[8px] uppercase tracking-widest font-bold border-t border-zinc-900 pt-10">
                  © 2024 WingMentor Operations. All systems normal. Property of Benjamin Bowler & Karl Vogt.
              </p>
          </div>
      </footer>
    </div>
  );
};
