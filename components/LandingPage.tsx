import React, { useRef, useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { DeveloperConsole } from './DeveloperConsole';
import { useTheme } from '../context/ThemeContext'; 
// Import RevealOnScroll component
import { RevealOnScroll } from './RevealOnScroll';
import { EpauletBars } from './EpauletBars'; // Import EpauletBars
import { MindMap } from './MindMap'; // Import the new MindMap component
import { PilotsStory } from './PilotsStory'; // Import the new PilotsStory component

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

const APPROACH_STEPS = [
  {
      num: "01",
      title: "THE DEBRIEF: PROBLEM IDENTIFIED",
      desc: "Following a lesson with your Certified Flight Instructor (CFI), you receive a grading sheet highlighting areas needing improvement. This document becomes the mission objective."
  },
  {
      num: "02",
      title: "THE CONSULTATION: SUPPORT REQUESTED",
      desc: "You submit the grading sheet and relevant notes through the Wing Mentor platform to schedule a session with a qualified mentor."
  },
  {
      num: "03",
      title: "THE ASSESSMENT: MENTOR ANALYSIS",
      desc: "Your Wing Mentor reviews the data, diagnoses the root cause of the issue, and prepares a tailored consultation plan. This is the 'Doctor's' preparation phase."
  },
  {
      num: "04",
      title: "THE SESSION: GUIDANCE PROVIDED",
      desc: "In a one-on-one session (online or in-person), the mentor guides you through the problem, utilizing diagrams, simulators, and practical examples to build deep understanding."
  },
  {
      num: "05",
      title: "THE LOGBOOK: EXPERIENCE VERIFIED",
      desc: "The session is meticulously documented in the official Wing Mentor logbook, detailing the issue, consultation provided, and duration, signed by the mentee. This creates a verifiable record of experience for the mentor."
  },
  {
      num: "06",
      title: "THE PRE-FLIGHT: PROFICIENCY APPLIED",
      desc: "Armed with new insights and strategies, you are fully prepared for your next flight with your CFI, ready to demonstrate mastery and turn a weakness into a strength."
  }
];


export const LandingPage: React.FC<LandingPageProps> = ({ isVideoWarm = false, setIsVideoWarm, onGoToProgramDetail, onGoToGapPage, onGoToOperatingHandbook, onGoToBlackBox, onGoToExaminationTerminal, scrollToSection, onScrollComplete, onGoToEnrollment }) => {
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

  // States for two separate carousels
  const [selectedActionIndex, setSelectedActionIndex] = useState(1); // Upper carousel
  const [selectedAppIndex, setSelectedAppIndex] = useState(2);       // Lower carousel
  
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
            console.warn("Autoplay with sound prevented:", error);
            if (!isMuted) {
                setIsMuted(true);
                if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.play().catch(e => console.error("Muted autoplay failed", e));
                }
            }
        }
    };
    
    if (!isLoading || isVideoWarm) {
        attemptPlay();
    }
  }, [isLoading, isMuted, isVideoWarm]);

  const handleScrollClick = (e: React.MouseEvent) => {
    const aboutSection = document.getElementById('about-program-overview-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLearnMoreApps = (e: React.MouseEvent) => {
    e.stopPropagation();
    const appsSection = document.getElementById('pilot-apps-made-by-pilots-section');
    if (appsSection) {
        appsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleWaiting = () => {
    if (!isVideoWarm) setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    if (setIsVideoWarm) setIsVideoWarm(true);
  };

  const handlePlaying = () => {
    setIsLoading(false);
    if (setIsVideoWarm) setIsVideoWarm(true);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    if (setIsVideoWarm) setIsVideoWarm(true);
  };

  const handleIconClick = (target: string) => {
    setLoadingApp(target); 
    
    setTimeout(() => {
        setLoadingApp(null); 
        switch (target) {
            case 'handbook':
                onGoToOperatingHandbook();
                break;
            case 'examination':
                onGoToExaminationTerminal();
                break;
            case 'gap':
                onGoToGapPage();
                break;
            case 'blackbox':
                onGoToBlackBox();
                break;
            default:
                break;
        }
    }, 2000); 
  };

  const textHighlight = isDarkMode ? 'text-blue-400' : 'text-blue-600';

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
        <h2 className={`text-3xl md:text-6xl font-['Raleway'] font-extrabold uppercase tracking-[0.1em] drop-shadow-2xl
                        ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Become a Wing Mentor
        </h2>
        <h2 className={`text-xl md:text-4xl font-['Raleway'] font-[200] uppercase tracking-widest drop-shadow-xl
                        ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
              {/* Animated Underline Container - Increased Plane Size */}
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
        <p className={`pt-4 text-[10px] md:text-sm tracking-wide uppercase opacity-80
                        dark:text-zinc-400 text-zinc-600`}>
            Welcome to Wing Mentor fellow pilot
        </p>
      </div>

      {/* Optimized Video Container - Width stabilized for 680px frame */}
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
                className="w-full h-full object-cover transition-opacity duration-1000" // Removed scale-[1.35] to fix cropping
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                poster={images.HERO_POSTER}
                onWaiting={handleWaiting}
                onCanPlay={handleCanPlay}
                onPlaying={handlePlaying}
                onLoadedData={handleLoadedData}
                src={images.HERO_VIDEO}
            >
                Your browser does not support the video tag.
            </video>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30 pointer-events-none"></div>

        <div className="absolute bottom-10 right-10 z-30">
            {isMuted ? (
                <button 
                    onClick={toggleMute}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-500 transition-all text-white hover:text-yellow-400 group shadow-lg cursor-pointer"
                >
                    <i className="fas fa-volume-mute text-sm group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-bold uppercase tracking-wider">Unmute</span>
                </button>
            ) : (
                <button 
                    onClick={toggleMute}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/60 hover:bg-zinc-800/80 backdrop-blur-md border border-zinc-500 transition-all text-white hover:text-yellow-400 group shadow-lg cursor-pointer"
                >
                    <i className="fas fa-volume-up text-sm group-hover:scale-110 transition-transform"></i>
                    <span className="text-xs font-bold uppercase tracking-wider">Mute</span>
                </button>
            )}
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
        
        {/* Action Icons Cover Flow - Scaled Smaller for a sleek look */}
        <div className="w-full flex flex-col items-center mb-16">
            <div className="w-full flex items-center justify-center h-[220px] relative">
                {/* Cover Flow Container */}
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
                        
                        let rotateY = 0;
                        if (offset < 0) rotateY = 75;
                        if (offset > 0) rotateY = -75;

                        const spacing = 30; 
                        const centerGap = 100;
                        let translateX = 0;
                        
                        if (offset < 0) translateX = (offset * spacing) - centerGap;
                        if (offset > 0) translateX = (offset * spacing) + centerGap;
                        if (isActive) translateX = 0;

                        const scale = isActive ? 1.2 : 0.7;
                        const zIndex = 100 - absOffset;
                        const brightness = isActive ? 1 : 0.15;
                        const opacity = isActive ? 1 : 0.6;

                        const style: React.CSSProperties = {
                            position: 'absolute',
                            width: '120px',
                            height: '120px',
                            left: '50%', 
                            top: '40%', 
                            marginLeft: '-60px',
                            marginTop: '-60px',
                            transform: `translateX(${translateX}px) translateZ(${isActive ? 0 : -200}px) rotateY(${rotateY}deg) scale(${scale})`,
                            zIndex: zIndex,
                            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: `brightness(${brightness})`,
                            opacity: opacity,
                            cursor: 'pointer'
                        };

                        return (
                            <div 
                              key={feature.target} 
                              style={style}
                              onClick={() => isActive ? handleIconClick(feature.target) : setSelectedActionIndex(index)}
                            >
                                <div className="w-full h-full relative group">
                                    <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition-colors rounded-xl"></div>
                                    <img 
                                        src={feature.image} 
                                        alt={feature.title} 
                                        className="w-full h-full object-cover rounded-xl shadow-2xl border border-zinc-800"
                                        style={{
                                            // @ts-ignore
                                            WebkitBoxReflect: `below 4px linear-gradient(transparent, transparent 65%, rgba(0,0,0,0.3))`
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls below carousel - Title in between arrows with Cross-Fade */}
            <div className="flex items-center justify-center gap-6 z-50 mt-2">
                <button 
                  onClick={() => setSelectedActionIndex(prev => Math.max(0, prev - 1))} 
                  disabled={selectedActionIndex === 0} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'} disabled:opacity-30 hover:bg-yellow-500 hover:text-black shadow-lg`}
                >
                    <i className="fas fa-chevron-left text-[10px]"></i>
                </button>
                
                <div className="relative w-[180px] h-10 flex items-center justify-center overflow-hidden">
                    {ACTION_ICONS.map((feature, idx) => (
                        <div 
                            key={feature.target}
                            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 transform ${selectedActionIndex === idx ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}
                        >
                            <h3 className="text-[10px] md:text-xs font-bold brand-font uppercase tracking-[0.2em] text-white text-center">
                                {feature.title}
                            </h3>
                            <div className="w-6 h-0.5 bg-yellow-500 mt-1"></div>
                        </div>
                    ))}
                </div>

                <button 
                  onClick={() => setSelectedActionIndex(prev => Math.min(ACTION_ICONS.length - 1, prev + 1))} 
                  disabled={selectedActionIndex === ACTION_ICONS.length - 1} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-200 text-black'} disabled:opacity-30 hover:bg-yellow-500 hover:text-black shadow-lg`}
                >
                    <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
            </div>
        </div>

        {/* Unified Link positioned on the border of the section - NOW WITH THE YELLOW PLANE */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
            <button 
                onClick={handleLearnMoreApps}
                className="group px-8 py-3 bg-black border border-zinc-700 rounded-full flex items-center gap-3 transition-all hover:border-yellow-500/50 shadow-2xl backdrop-blur-md"
            >
                <img 
                    src={images.RUNWAY_HOLDING_POINT} 
                    alt="Learn More" 
                    className="w-6 h-6 object-contain animate-bounce group-hover:scale-110 transition-transform"
                    style={{ filter: 'brightness(1)' }}
                />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-yellow-500">
                    learn more about pilot apps
                </span>
            </button>
        </div>
      </div>

      <PilotsStory />
      ...