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
            <span className={`relative inline-flex items-center gap-x-2 md:gap-x-4 align-middle border-b-2 pb-0.5 ${isDarkMode ? 'border-white/50' : 'border-black/50'}`}>
                Low timer
                
                {/* Mechanical VOR Revolve - Total Loop 5.5s (5s + 0.5s hold) */}
                <div className="revolve-container">
                  <div className="revolve-inner" style={{ animation: 'to-fr-revolve 5.5s linear infinite' }}>
                    <span className="revolve-face face-to">TO</span>
                    <span className="revolve-face face-flag"></span>
                    <span className="revolve-face face-fr">FR</span>
                  </div>
                </div>

                wing mentor
                {/* Sliding Icon on underline - Synchronized at 5.5s loop with intensified glow */}
                <img 
                    src="https://lh3.googleusercontent.com/d/1i9gQqjVWESQsafz3ARNO1zupAQ_Xu6K4"
                    alt=""
                    className="absolute -bottom-[18px] md:-bottom-[22px] w-10 h-10 md:w-12 md:h-12 object-contain pointer-events-none z-20 animate-icon-glow"
                    style={{ 
                        animation: 'underline-slide 5.5s linear infinite, icon-pulse-glow 2s ease-in-out infinite',
                    }}
                />
            </span>
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

        {/* Unified Link positioned on the border of the section */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 flex justify-center">
            <button 
                onClick={handleLearnMoreApps}
                className="px-8 py-3 bg-black border border-zinc-700 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all shadow-2xl backdrop-blur-md"
            >
                learn more about pilot apps <i className="fas fa-chevron-right ml-2 text-[8px] animate-pulse"></i>
            </button>
        </div>
      </div>

      <PilotsStory />

      <div 
        id="about-program-overview-section"
        className={`w-full relative py-24 px-6 flex flex-col items-center justify-center transition-colors duration-500
                    ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-100 text-black'} border-y ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}
      >
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5" style={{ backgroundImage: `url(${images.MINDMAP_SECTION_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className={`absolute inset-0 z-0 ${isDarkMode ? 'bg-black/80' : 'bg-zinc-100/80'}`}></div>


          <div className="relative z-10 w-full max-w-7xl mx-auto text-center">
              <RevealOnScroll>
                  <div className="flex justify-center mb-6">
                      <img src={images.LOGO} alt="Wing Mentor Logo" className="w-64 md:w-[450px] h-auto object-contain" />
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      About Program & Apps
                  </h2>
                  <p className={`text-xl md:text-2xl leading-relaxed mb-12 ${textHighlight}`}>
                      Transforming Low-Time Pilots into Verifiable Assets.
                  </p>
              </RevealOnScroll>

              <RevealOnScroll delay={100} className="max-w-4xl mx-auto mb-16 text-left">
                  <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-zinc-700/50 relative group mb-10">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                      <img 
                          src="https://lh3.googleusercontent.com/d/143EeRX8BneoJRBh32bD4UgpHLUByBCbc" 
                          alt="Wing Mentor Session Analysis" 
                          className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-xs font-bold uppercase tracking-widest text-center">Verified Logged Guidance & Consultation</p>
                      </div>
                  </div>

                  <div className={`text-lg leading-relaxed space-y-6 font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      <p>
                          The WingMentor program creates a symbiotic environment where both mentor and mentee gain valuable experience. Every logged mentor session is another tangible step towards your program goals. Within the WingMentor framework, you will assess and learn how to understand and assess mentees on their decision-making thinking—whether it is in a simulator practice session or analyzing complex <span className="font-bold">IFR approach charts</span>.
                      </p>
                      <p>
                          The more detailed the session, the more profound the Crew Resource Management (CRM) skills you gain. You are building capability not just as a mentor, but as a pilot who can expertly consult and assess problem-solving skills in high-stakes environments.
                      </p>
                  </div>
              </RevealOnScroll>

              <RevealOnScroll delay={150} className="flex justify-center mb-24">
                  <button 
                      onClick={onGoToProgramDetail}
                      className="px-10 py-5 bg-red-700 hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-full shadow-2xl transform transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group"
                  >
                      <i className="fas fa-info-circle text-xl group-hover:rotate-12 transition-transform"></i>
                      Learn more about the program
                  </button>
              </RevealOnScroll>

              {/* NEW SECTION: Milestones & Achievements */}
              <RevealOnScroll delay={200} className="max-w-4xl mx-auto mb-24 text-center">
                  <h3 className={`text-3xl md:text-4xl font-bold brand-font uppercase tracking-widest mb-12 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Milestones & Achievements
                  </h3>
                  
                  <div className="mb-12">
                      <p className={`text-lg md:text-xl leading-relaxed font-light mb-12 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                          Throughout your mentorship journey, your dedication is tracked and celebrated. You will receive recognition through <span className="font-bold">official digital badges</span>, exclusive pilot awards, and a progressive rank structure. Every milestone you reach within the WingMentor ecosystem is a verifiable achievement that signals your growth as an aviator and a leader. We provide <span className="font-bold">Program Completion Certificates</span> and specialized awards for mentors who exhibit exceptional CRM and technical consultation skills. These aren't just pieces of paper; they are assets for your professional portfolio, proving you have been vetted and recognized by a senior panel of industry professionals.
                      </p>
                      
                      <div className="flex justify-center">
                          <div className={`relative p-2 rounded-2xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} shadow-2xl overflow-hidden group max-w-2xl`}>
                              <img 
                                src="https://lh3.googleusercontent.com/d/112h6L1fuk_wR5HVZEtiDJY7Xz02KyEbx" 
                                alt="WingMentor Milestones & Achievements" 
                                className="w-full h-auto object-cover rounded-xl transform transition-transform duration-700 group-hover:scale-105"
                              />
                          </div>
                      </div>
                  </div>
              </RevealOnScroll>

              <RevealOnScroll delay={300} className="max-w-4xl mx-auto mb-16 text-left">
                  <h3 className={`text-2xl md:text-3xl font-bold brand-font uppercase mb-6 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Differentiation: Flight Instructor vs Wing Mentor Consultancy Approach
                  </h3>

                  <div className="w-full rounded-xl overflow-hidden shadow-2xl mb-8 group relative">
                      <img 
                          src={images.INSTRUCTION_VS_CONSULTANCY_IMG}
                          alt="Instruction vs Consultancy" 
                          className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                  </div>

                  <div className={`text-lg leading-relaxed space-y-6 font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      <p>
                          It is crucial to understand the distinction: <span className="font-bold">We do not teach lectures or seminars.</span> It is not our role to teach initial concepts or replace your flight school's curriculum. Instead, our mission is to <span className="font-bold">support and consult</span> based on your specific performance within your education and flight training in the aviation industry.
                      </p>
                      <p>
                          Whether you are a <span className="font-bold">student pilot</span> struggling with a specific maneuver, a <span className="font-bold">flight instructor</span> looking to refine your briefing techniques, or a <span className="font-bold">pilot returning after 10 years</span> who needs a skills refresher to get back in the cockpit—this is where WingMentor comes in. We analyze your performance gaps and provide the targeted consultation needed to bridge them.
                      </p>
                  </div>

                  <div className="mt-10 flex flex-col items-center space-y-6">
                      <p className={`text-sm italic font-medium tracking-wide text-center max-w-2xl mx-auto ${isDarkMode ? 'text-zinc-400' : 'text-zinc-50'}`}>
                        Read more engaging sketched pilot real life scenarios in our handbook
                      </p>
                      <button 
                          onClick={onGoToOperatingHandbook}
                          className={`px-10 py-5 rounded-full tracking-widest text-lg font-black transition-all shadow-xl border-4
                                      ${isDarkMode 
                                          ? 'bg-blue-600 border-zinc-300 hover:bg-blue-500 text-white shadow-blue-900/20' 
                                          : 'bg-blue-700 border-zinc-400 hover:bg-blue-600 text-white shadow-blue-200'}
                                      animate-master-switch-pulse`}
                      >
                          READ THE HANDBOOK AS A REQUIREMENT OF THE PROGRAM <i className="fas fa-book-open ml-3"></i>
                      </button>
                  </div>
              </RevealOnScroll>

              <RevealOnScroll delay={300} className="max-w-4xl mx-auto mb-16">
                  <div className={`p-6 md:p-8 rounded-xl border ${isDarkMode ? 'border-zinc-800 bg-zinc-900/30' : 'border-zinc-200 bg-white/50'}`}>
                      <div className="text-left mb-6">
                          <h3 className={`text-xl md:text-2xl font-bold brand-font uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                              The Wing Mentor Approach Chart
                          </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-left">
                          {APPROACH_STEPS.map((step, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                  <span className="text-yellow-500 font-bold font-mono text-lg shrink-0 mt-0.5">{step.num}.</span>
                                  <div>
                                      <h4 className={`text-xs md:text-sm font-bold uppercase mb-1 ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{step.title}</h4>
                                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{step.desc}</p>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className={`mt-8 pt-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} text-zinc-500`}>
                          <p className="text-xs italic">
                              "Within your first 20 hours, you will be supervised by one of our Wing Mentor team members. Once completed, your Wing Mentor passport will be stamped, marking your first milestone."
                          </p>
                      </div>
                  </div>
              </RevealOnScroll>

              <RevealOnScroll delay={400}>
                  <div className={`text-lg md:text-xl font-light leading-relaxed notam-font mb-12 max-w-4xl mx-auto ${isDarkMode ? 'text-white' : 'text-zinc-900'} space-y-6`}>
                      <p>
                          The Wing Mentor program is not a flight school; we provide the solution to the 'experience paradox' for low-timer pilots. For mentors, this is your opportunity to gain hands-on CRM and consultation experience, building a verifiable logbook that sets you apart. We have watched too many talented pilots give up due to industry standards and market saturation. Our handbook details not just the program, but the unfiltered reality that recent commercial pilots face.
                      </p>
                  </div>
              </RevealOnScroll>

              {/* BECOMING A WING MENTOR SECTION (FOR MENTORS) */}
              <RevealOnScroll delay={450} className="max-w-4xl mx-auto mb-12">
                  <div className={`p-8 border-l-4 border-red-600 rounded-r-xl shadow-xl relative overflow-hidden group ${isDarkMode ? 'bg-zinc-900/80 border-red-600' : 'bg-white border-red-600'}`}>
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-600/10 rounded-full blur-xl group-hover:bg-red-600/20 transition-all duration-500"></div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="flex-1 text-left">
                                <h3 className={`text-2xl md:text-3xl font-bold brand-font uppercase mb-3 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    Becoming a Wing Mentor
                                </h3>
                                <p className={`text-sm md:text-base leading-relaxed mb-6 font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    Walk into an interview not just with a license, but with the leverage to say, <span className="italic font-semibold">'I have supported and guided pilots.'</span> Transform your flight hours into verifiable leadership experience. Join our team of qualified mentors and build a professional portfolio that airlines respect.
                                </p>
                                <button 
                                    onClick={onGoToEnrollment}
                                    className="px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold uppercase tracking-widest rounded-md shadow-lg transition-all transform hover:translate-x-2 flex items-center"
                                >
                                    Enroll As Mentor <i className="fas fa-plane-departure ml-3"></i>
                                </button>
                            </div>
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 hidden md:block shadow-md border border-zinc-500/20 transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                <img src={images.STORY_CPL} alt="Wing Mentor" className="w-full h-full object-cover" />
                            </div>
                        </div>
                  </div>
              </RevealOnScroll>

              {/* ENROLL AS MENTEE SECTION */}
              <RevealOnScroll delay={500} className="max-w-4xl mx-auto mb-16">
                  <div className={`p-8 border-l-4 border-blue-600 rounded-r-xl shadow-xl relative overflow-hidden group ${isDarkMode ? 'bg-zinc-900/80 border-blue-600' : 'bg-white border-blue-600'}`}>
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl group-hover:bg-red-600/20 transition-all duration-500"></div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="flex-1 text-left">
                                <h3 className={`text-2xl md:text-3xl font-bold brand-font uppercase mb-3 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    Enroll Now As Mentee
                                </h3>
                                <p className={`text-sm md:text-base leading-relaxed mb-6 font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    Gain a decisive advantage in your flight training. Receive personalized guidance, unlock the Black Box Knowledge Vault, and connect with experienced mentors who have already walked the path to the cockpit. Your career trajectory starts with the right support.
                                </p>
                                <button 
                                    onClick={onGoToEnrollment}
                                    className="px-8 py-3 bg-blue-700 hover:bg-blue-600 text-white font-bold uppercase tracking-widest rounded-md shadow-lg transition-all transform hover:translate-x-2 flex items-center"
                                >
                                    Enroll As Mentee <i className="fas fa-graduation-cap ml-3"></i>
                                </button>
                            </div>
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 hidden md:block shadow-md border border-zinc-500/20 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                                <img src={images.STORY_STUDENT} alt="Wing Mentee" className="w-full h-full object-cover" />
                            </div>
                        </div>
                  </div>
              </RevealOnScroll>

              {/* MENTEE DESCRIPTION PARAGRAPH BELOW CTA */}
              <RevealOnScroll delay={550}>
                  <div className={`text-lg md:text-xl font-light leading-relaxed notam-font mb-12 max-w-4xl mx-auto ${isDarkMode ? 'text-white' : 'text-zinc-900'} space-y-6`}>
                      <p>
                          For the <strong className={textHighlight}>Mentee</strong>, your path is one of guided growth. Your mission is to absorb, learn, and overcome challenges with the support of a dedicated mentor. Upon successful enrollment and a vetting interview, you gain access to the <strong>Wing Mentor Knowledge Vault</strong>—our comprehensive library of resources including study materials for PPL, CPL, IR, and ME ratings. This is about building a deep, practical understanding that prepares you for your next lesson and instills the confidence to command a career.
                      </p>
                  </div>
              </RevealOnScroll>

              {/* Extended Black Space for Pilot Apps Suite */}
              <div id="pilot-apps-made-by-pilots-section" className="mt-20 w-full bg-black border-y border-zinc-900 py-48 px-6 flex flex-col items-center">
                <RevealOnScroll>
                    <h2 className="text-3xl md:text-6xl font-bold brand-font uppercase tracking-[0.15em] text-center text-white mb-6">
                        pilot apps <br />
                        <span className="text-yellow-500">made by pilots</span>
                    </h2>
                    <p className="text-sm md:text-lg font-light text-zinc-500 uppercase tracking-[0.2em] text-center max-w-3xl mx-auto mb-24 leading-relaxed">
                        The ultimate digital ecosystem for mission readiness. <br/> 
                        Access every tool you need to navigate the industry gap through our bespoke software suite.
                    </p>
                </RevealOnScroll>

                {/* Apple Cover Flow Carousel Section */}
                <div className="w-full flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-center">
                        {/* Cover Flow Container */}
                        <div 
                            className="relative w-full max-w-5xl h-[420px] flex justify-center items-center" 
                            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={(e) => handleTouchEnd(e, 'app')}
                        >
                            {appSuiteData.map((app, index) => {
                                const offset = index - selectedAppIndex;
                                const absOffset = Math.abs(offset);
                                const isActive = offset === 0;
                                
                                let rotateY = 0;
                                if (offset < 0) rotateY = 65;
                                if (offset > 0) rotateY = -65;

                                const spacing = 50; 
                                const centerGap = 200;
                                let translateX = 0;
                                
                                if (offset < 0) translateX = (offset * spacing) - centerGap;
                                if (offset > 0) translateX = (offset * spacing) + centerGap;
                                if (isActive) translateX = 0;

                                const scale = isActive ? 1.35 : 0.75;
                                const zIndex = 100 - absOffset;
                                const brightness = isActive ? 1 : 0.2;
                                const opacity = isActive ? 1 : 0.5;

                                const style: React.CSSProperties = {
                                    position: 'absolute',
                                    width: '280px',
                                    height: '280px',
                                    left: '50%', 
                                    top: '40%', 
                                    marginLeft: '-140px', 
                                    marginTop: '-140px',
                                    transform: `translateX(${translateX}px) translateZ(${isActive ? 0 : -300}px) rotateY(${rotateY}deg) scale(${scale})`,
                                    zIndex: zIndex,
                                    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                                    filter: `brightness(${brightness})`,
                                    opacity: opacity,
                                    cursor: 'pointer'
                                };

                                return (
                                    <div 
                                        key={app.title} 
                                        style={style}
                                        onClick={() => setSelectedAppIndex(index)}
                                    >
                                        <div className="w-full h-full relative group">
                                            <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-colors rounded-2xl"></div>
                                            <img 
                                                src={app.image} 
                                                alt={app.title} 
                                                className="w-full h-full object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-zinc-800"
                                                style={{
                                                    // @ts-ignore
                                                    WebkitBoxReflect: `below 10px linear-gradient(transparent, transparent 65%, rgba(255,255,255,0.08))`
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-center gap-12 mt-8 mb-24 z-50">
                            <button onClick={() => setSelectedAppIndex(prev => Math.max(0, prev - 1))} disabled={selectedAppIndex === 0} className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-zinc-900 border border-zinc-800 text-white disabled:opacity-30 hover:bg-yellow-500 hover:text-black shadow-2xl">
                                <i className="fas fa-chevron-left text-sm"></i>
                            </button>
                            
                            <div className="flex space-x-2">
                                {appSuiteData.map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${selectedAppIndex === i ? 'bg-yellow-500 w-4' : 'bg-zinc-800'}`}></div>
                                ))}
                            </div>

                            <button onClick={() => setSelectedAppIndex(prev => Math.min(appSuiteData.length - 1, prev + 1))} disabled={selectedAppIndex === appSuiteData.length - 1} className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-zinc-900 border border-zinc-800 text-white disabled:opacity-30 hover:bg-yellow-500 hover:text-black shadow-2xl">
                                <i className="fas fa-chevron-right text-sm"></i>
                            </button>
                        </div>
                    </div>
                    
                    {/* Centered App Description with Robust Cross-Fade Effect */}
                    <div className="relative w-full max-w-4xl mx-auto h-72 px-10 text-center flex items-center justify-center mb-16">
                        {appSuiteData.map((app, index) => (
                            <div 
                                key={app.title} 
                                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-800 ease-in-out transform 
                                           ${selectedAppIndex === index 
                                             ? 'opacity-100 translate-y-0 scale-100 blur-0' 
                                             : 'opacity-0 translate-y-8 scale-95 blur-sm pointer-events-none'}`}
                            >
                                <h3 className="text-3xl md:text-5xl font-bold brand-font uppercase tracking-[0.4em] text-white mb-6 drop-shadow-2xl">
                                    {app.title}
                                </h3>
                                <div className="w-20 h-1 bg-yellow-500 mb-10 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                                <p className="text-lg md:text-xl leading-relaxed font-light text-zinc-300 max-w-3xl text-center italic px-4">
                                    {app.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Featured iPad Image - Stays in the Black Section */}
                    <div className="mt-40 w-full flex flex-col items-center">
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-20"></div>
                        <h3 className="text-2xl md:text-3xl font-bold brand-font uppercase mb-12 text-center text-white tracking-[0.2em]">
                            WingMentor App Suite <span className="text-yellow-600/50 ml-3">Digital Core</span>
                        </h3>
                        <div className="rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] max-w-5xl mx-auto bg-zinc-950 border border-zinc-900 group p-2">
                            <img 
                                src={images.IPAD_APPS_IMG} 
                                alt="WingMentor Digital Command Center" 
                                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100 rounded-[2.5rem]" 
                            />
                        </div>
                    </div>
                </div>
              </div>
          </div>
      </div>

      {/* How We Fill The Aviation Low Timer Pilot Gap */}
      <div 
        id="how-we-fill-gap-section"
        className="w-full bg-black"
      >
        <div className="w-full relative pt-24 pb-16 px-6 flex flex-col items-center justify-center">
            <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
                <RevealOnScroll delay={100}>
                    <h2 className="text-4xl md:text-6xl font-bold brand-font uppercase tracking-wider mb-6 text-white">
                        How We Filled The Aviation Low Timer Pilot Gap
                    </h2>
                    <h3 className="text-xl md:text-3xl font-light leading-relaxed uppercase tracking-widest text-zinc-300">
                        Visualizing the Pilot's Journey: Bridging the Red Gap
                    </h3>
                </RevealOnScroll>
            </div>
        </div>

        <div className="px-6 pb-16">
            <RevealOnScroll delay={150}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950 group max-w-7xl mx-auto">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1cyHKAiNbxXZltgOwIk5wxZg2_J_2ShGO" 
                      alt="Aviation Gap Strategic Blueprint" 
                      className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
            </RevealOnScroll>
        </div>

        <div className="w-full relative pb-24 px-6 flex flex-col items-center justify-center">
            <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
                <RevealOnScroll delay={200}>
                  <p className="text-center text-zinc-500 text-xs mb-12 uppercase tracking-widest animate-pulse relative z-10">
                    Hover over nodes to reveal details • Click nodes to unfold the story
                  </p>
                </RevealOnScroll>
                
                <MindMap />

                <RevealOnScroll delay={700}>
                    <button 
                    onClick={onGoToGapPage}
                    className={`px-10 py-4 rounded-full tracking-widest text-lg font-bold transition-all shadow-xl mt-16
                                bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20`}
                    >
                    Access Our Pilot Gap Forum For More Information <i className="fas fa-arrow-right ml-3"></i>
                    </button>
                    <p className="mt-4 text-sm max-w-xl mx-auto text-zinc-400">
                    Insight into previous pilot investments so that you don’t have to experience and avoid hardship and loss.
                    </p>
                </RevealOnScroll>
            </div>
        </div>
      </div>

      <div 
        id="why-wing-mentor-section"
        className={`w-full relative py-24 px-6 flex flex-col items-center justify-center transition-colors duration-500
                    ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'}`}>
        <RevealOnScroll delay={100} className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest mb-8 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            Why Wing Mentor?
          </h2>
          <p className={`text-xl md:text-2xl leading-relaxed mb-12 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            We exist to solve the industry's toughest challenge: the "experience paradox." Wing Mentor is the innovative bridge for low-time pilots, offering verifiable mentorship, crucial skill refinement, and a supportive community. It's not just about getting hours; it's about gaining the confidence and documented experience that truly sets you apart.
          </p>
          <button 
            onClick={onGoToProgramDetail}
            className={`px-10 py-4 rounded-full tracking-widest text-lg font-bold transition-all shadow-xl
                        ${isDarkMode 
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                            : 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-200'}`}
          >
            Explore Our Program <i className="fas fa-arrow-right ml-3"></i>
          </button>
        </RevealOnScroll>
      </div>

      <div 
        id="about-us-section"
        className="w-full min-h-screen relative flex flex-col items-center justify-center py-32 md:py-48 overflow-hidden" 
      >
         <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
                src={images.ABOUT_BG} 
                alt="About Page Background" 
                className="w-full h-full object-cover object-center scale-150 sm:scale-100" 
                style={{
                    filter: isDarkMode ? 'grayscale(0.6) blur(2px)' : 'grayscale(0.2) blur(2px) opacity(0.6)', 
                    pointerEvents: 'none'
                }} 
            />
            <div className={`absolute inset-0 z-10 ${isDarkMode ? 'bg-black/60' : 'bg-white/80'}`}></div> 
         </div>

         <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-12 mb-16">
                
                <RevealOnScroll className="mb-4">
                  <div className={`flex justify-center mb-8 backdrop-blur-sm p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-black/50' : 'bg-white/70 border border-zinc-200'}`}>
                      <img 
                          src={images.ABOUT_US_HEADER_IMAGE} 
                          alt="About Us Header Graphic" 
                          className="w-64 md:w-80 h-auto object-contain" 
                      />
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest
                                  ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      About Wing Mentor
                  </h2>
                </RevealOnScroll>
                <div className={`w-32 h-1 mx-auto ${isDarkMode ? 'bg-red-600' : 'bg-red-50'}`}></div>
            </div>

            <div className="mb-24">
                <RevealOnScroll className="mb-16">
                  <h3 className={`text-3xl md:text-4xl font-bold brand-font uppercase text-center tracking-widest
                                ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Meet The Founders
                  </h3>
                </RevealOnScroll>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    
                    <RevealOnScroll delay={100} className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border
                                    ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-yellow-600/50' : 'bg-white/70 border border-zinc-200 hover:border-blue-400'}`}>
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl mb-6 relative group">
                            <img 
                                src={images.BENJAMIN_BOWLER_PORTRAIT} 
                                alt="Benjamin Tiger Bowler" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h4 className={`text-2xl font-bold brand-font uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            Benjamin Tiger Bowler
                        </h4>
                        <span className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                            Founder
                        </span>
                        <p className={`text-sm md:text-base leading-relaxed notam-font ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            "We couldn't stand by and watch qualified pilots give up. Wing Mentor is our answer to the 'experience paradox'—providing a structured environment where pilots can prove their worth and keep their dreams alive."
                        </p>
                    </RevealOnScroll>

                    <RevealOnScroll delay={200} className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border
                                    ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-yellow-600/50' : 'bg-white/70 border border-zinc-200 hover:border-blue-400'}`}>
                        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-yellow-500 shadow-xl mb-6 relative group">
                             <img 
                                src={images.KARL_VOGT_PORTRAIT} 
                                alt="Karl Brian Vogt" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <h4 className={`text-2xl font-bold brand-font uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            Karl Brian Vogt
                        </h4>
                        <span className={`text-sm font-bold uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>
                            Founder
                        </span>
                        <p className={`text-sm md:text-base leading-relaxed notam-font ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                            "The aviation industry demands more than just hours; it demands leadership, critical thinking, and adaptability. Wing Mentor cultivates these essential qualities, preparing pilots to not just fill a seat, but to command a career. We're building aviators of influence."
                        </p>
                    </RevealOnScroll>
                </div>
            </div>
         </div>
      </div>

      <footer id="contact-us-section" className="bg-black border-t border-zinc-900 pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <img src={images.LOGO} alt="Wing Mentor Logo" className="w-12 h-12 object-contain filter brightness-0 invert opacity-90" />
                    <span className="text-xl font-bold brand-font text-white uppercase tracking-widest">Wing Mentor</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed max-sm">
                    Bridging the gap between license and career. A dedicated platform for low-timer pilots to build verifiable experience, command authority, and professional industry connections.
                </p>
                <div className="flex items-center space-x-4">
                    <a href="#" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                        <i className="fab fa-facebook-f text-xs"></i>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                        <i className="fab fa-instagram text-xs"></i>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
                        <i className="fab fa-twitter text-xs"></i>
                    </a>
                </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white border-b border-zinc-800 pb-2 inline-block">Flight Operations</h4>
                <ul className="space-y-4 text-xs text-zinc-400">
                    <li className="flex items-start space-x-3">
                        <i className="fas fa-map-marker-alt mt-1 text-yellow-600"></i>
                        <span>Manila, Philippines<br/>Global Remote Operations</span>
                    </li>
                    <li className="flex items-start space-x-3">
                        <i className="fas fa-envelope mt-1 text-yellow-600"></i>
                        <a href="mailto:wingmentorprogram@gmail.com" className="hover:text-white transition-colors">wingmentorprogram@gmail.com</a>
                    </li>
                    <li className="flex items-start space-x-3">
                        <i className="fas fa-headset mt-1 text-yellow-600"></i>
                        <span>Support Frequency: 123.45</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white border-b border-zinc-800 pb-2 inline-block">System Status</h4>
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Mentor Level</span>
                        <span className="text-[10px] uppercase font-bold text-green-500">Active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <EpauletBars count={4} size="small" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Captain / Mentor</span>
                    </div>
                    <div className="w-full h-px bg-zinc-800 my-3"></div>
                    <p className="text-[10px] text-zinc-600">
                        Authorized Personnel Only. <br/>
                        System ID: WM-2024-ALPHA
                    </p>
                </div>
            </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-600 uppercase tracking-wider">
            <p>&copy; 2024 WingMentor. All Rights Reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
                <a href="#" className="hover:text-zinc-400">Terms of Service</a>
                <a href="#" className="hover:text-zinc-400">POH Reference</a>
            </div>
        </div>
      </footer>
    </div>
  );
};