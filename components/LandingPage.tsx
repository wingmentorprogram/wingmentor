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
      description: 'Access the official Program Operating Handbook.', 
      target: 'handbook', 
      image: 'https://lh3.googleusercontent.com/d/1GbUopHNGyXMhzi5sW1Ybo5gZMh2_YSKN' 
    },
    { 
      icon: 'fa-terminal', 
      title: 'Examination Terminal', 
      description: 'Prepare for checkrides and knowledge tests.', 
      target: 'examination', 
      image: 'https://lh3.googleusercontent.com/d/11j7ZHv874EBZZ6O36etvuHC6rRWWm8kF' 
    },
    { 
      icon: 'fa-exclamation-triangle', 
      title: 'Pilot Gap Forum', 
      description: 'Discuss industry challenges with peers and mentors.', 
      target: 'gap',
      image: 'https://lh3.googleusercontent.com/d/1InHXB-jhAZ3UNDXcvHbENwbB5ApY8eOp' 
    },
    { 
      icon: 'fa-box-open', 
      title: 'The Black Box', 
      description: 'Unlock deeply guarded information and resources.', 
      target: 'blackbox', 
      image: 'https://lh3.googleusercontent.com/d/18in9LNCamnoxyJATd4qxioMSgb4V8zVv' 
    },
];

export const LandingPage: React.FC<LandingPageProps> = ({ isVideoWarm = false, setIsVideoWarm, onGoToProgramDetail, onGoToGapPage, onGoToOperatingHandbook, onGoToBlackBox, onGoToExaminationTerminal, scrollToSection, onScrollComplete, onGoToEnrollment }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { config } = useConfig();
  const { images } = config; 
  const { isDarkMode } = useTheme(); 
  
  const [isDevConsoleOpen, setDevConsoleOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(!isVideoWarm);
  
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [loadingApp, setLoadingApp] = useState<string | null>(null);

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
            <span className="inline-flex items-center gap-x-2 md:gap-x-4 align-middle">
                Low timer
                <img 
                    src={images.RUNWAY_HOLDING_POINT}
                    alt="to"
                    className="w-10 h-10 md:w-14 md:h-14 object-contain transition-all"
                    style={{ filter: isDarkMode ? 'invert(0)' : 'brightness(0.5)' }} 
                />
                wing mentor
            </span>
        </h2>
        <p className={`pt-4 text-[10px] md:text-sm tracking-wide uppercase opacity-80
                        dark:text-zinc-400 text-zinc-600`}>
            Welcome to Wing Mentor fellow pilot
        </p>
      </div>

      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden group flex flex-col border-t border-zinc-300 dark:border-zinc-900 bg-black">
        
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
                className="w-full h-full object-cover scale-[1.35]" 
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
      
      <div className="w-full py-16 md:py-24 bg-black border-y border-zinc-900 relative">
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
        
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-8 mb-16">
          {ACTION_ICONS.map((feature, index) => {
            const isHovered = hoveredApp === feature.target;
            const isBlurred = hoveredApp !== null && hoveredApp !== feature.target;

            return (
                <RevealOnScroll key={feature.target} delay={index * 100}>
                  <div 
                    className={`transition-all duration-500 ease-out transform
                        ${isHovered ? 'scale-110 z-20' : 'z-10'}
                        ${isBlurred ? 'blur-[4px] scale-90 opacity-40 grayscale' : ''}
                    `}
                    onMouseEnter={() => setHoveredApp(feature.target)}
                    onMouseLeave={() => setHoveredApp(null)}
                  >
                      <button
                        onClick={() => handleIconClick(feature.target)}
                        className="w-full h-full p-4 md:p-6 text-center rounded-xl transition-all duration-300 focus:outline-none group relative flex flex-col items-center"
                      >
                        <div className={`flex items-center justify-center w-28 h-28 md:w-40 md:h-40 mx-auto mb-4 
                                        ${feature.image ? 'rounded-3xl border-0 shadow-2xl' : 'rounded-full border border-zinc-800'} 
                                        bg-zinc-900 text-yellow-500 transition-all duration-500 overflow-hidden relative shadow-lg
                                        ${!feature.image ? 'group-hover:bg-yellow-500 group-hover:text-black' : ''}`}>
                          {feature.image ? (
                              <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                              <i className={`fas ${feature.icon} text-5xl md:text-6xl transition-transform duration-300 group-hover:rotate-12`}></i>
                          )}
                        </div>
                        <h4 className={`text-[11px] md:text-sm font-black uppercase tracking-[0.2em] transition-colors duration-300
                                      ${isHovered ? 'text-white' : 'text-zinc-50'}`}>
                            {feature.title}
                        </h4>
                      </button>
                  </div>
                </RevealOnScroll>
            );
          })}
        </div>

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

      {/* NEW: Mobile Flight Deck Experience Section */}
      <div 
        id="pilot-apps-made-by-pilots-section"
        className={`w-full py-24 px-6 relative overflow-hidden transition-colors duration-500
                    ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'}`}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <RevealOnScroll className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold brand-font uppercase tracking-widest mb-6">
                Mobile Flight Deck
            </h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
            <p className="max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed text-zinc-500 italic">
                Optimized for operational excellence. Experience the WingMentor suite with seamless screen adjustments for every device in your flight bag.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* iPhone 11 Pro Mockup */}
            <RevealOnScroll delay={100} className="flex flex-col items-center">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Phone Body */}
                <div className={`relative w-[280px] h-[580px] md:w-[320px] md:h-[660px] rounded-[3rem] border-[8px] shadow-2xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500
                                 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-zinc-900/50' : 'bg-zinc-200 border-zinc-300 shadow-zinc-300/50'}`}>
                   {/* Screen Notch */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-900 rounded-b-2xl z-30"></div>
                   
                   {/* Image Content */}
                   <img 
                      src={images.IPHONE_11_PRO_IMG} 
                      alt="App on iPhone 11 Pro" 
                      className="w-full h-full object-cover"
                   />
                </div>
                
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold brand-font uppercase tracking-widest text-zinc-500">iPhone 11 Pro</h3>
                    <p className="text-xs font-mono mt-1 opacity-60">Classic Compact Profile</p>
                </div>
              </div>
            </RevealOnScroll>

            {/* iPhone 16 Pro Mockup */}
            <RevealOnScroll delay={300} className="flex flex-col items-center">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Phone Body */}
                <div className={`relative w-[300px] h-[620px] md:w-[340px] md:h-[700px] rounded-[3.5rem] border-[4px] shadow-2xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500
                                 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 shadow-zinc-900/50' : 'bg-zinc-100 border-zinc-200 shadow-zinc-200/50'}`}>
                   {/* Island Camera */}
                   <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30"></div>
                   
                   {/* Image Content */}
                   <img 
                      src={images.IPHONE_16_PRO_IMG} 
                      alt="App on iPhone 16 Pro" 
                      className="w-full h-full object-cover"
                   />
                </div>
                
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-bold brand-font uppercase tracking-widest text-yellow-500">iPhone 16 Pro</h3>
                    <p className="text-xs font-mono mt-1 opacity-60">Ultra-Thin Bezel Experience</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={500} className="mt-24 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/20 text-center backdrop-blur-sm">
             <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 text-zinc-400">Tactical Advantage</h4>
             <p className="max-w-2xl mx-auto text-base notam-font opacity-80 leading-relaxed">
                Our dynamic layout engine automatically adjusts typography, navigation reachability, and touch targets to ensure your "Black Box" data is readable whether you're in the hangar or at 10,000 feet.
             </p>
          </RevealOnScroll>
        </div>
      </div>

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
          </div>
      </div>
    </div>
  );
};