
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


export const LandingPage: React.FC<LandingPageProps> = ({ isVideoWarm = false, setIsVideoWarm, onGoToProgramDetail, onGoToGapPage, onGoToOperatingHandbook, onGoToBlackBox, onGoToExaminationTerminal, scrollToSection, onScrollComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const programPageRef = useRef<HTMLDivElement>(null); 
  const { config } = useConfig();
  const { images } = config; // Use dynamic images
  const { isDarkMode } = useTheme(); 
  
  const [isDevConsoleOpen, setDevConsoleOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(!isVideoWarm);
  const [programPageVisible, setProgramPageVisible] = useState(false); 
  
  // State for hover effect on apps
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  
  // State for App Loading Overlay
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

  // Autoplay Logic
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

  // Observer for Program Page Background Overlay
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProgramPageVisible(true);
          observer.disconnect(); 
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    if (programPageRef.current) {
      observer.observe(programPageRef.current);
    }

    return () => {
      if (programPageRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const handleScrollClick = (e: React.MouseEvent) => {
    const programSection = document.getElementById('program-section');
    if (programSection) {
      programSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    setLoadingApp(target); // Start loading state
    
    setTimeout(() => {
        setLoadingApp(null); // Clear loading state
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
    }, 2000); // 2 second delay for loading animation
  };

  const textHighlight = isDarkMode ? 'text-blue-400' : 'text-blue-600';

  return (
    <div className="relative pt-32 min-h-screen bg-white dark:bg-black flex flex-col animate-in fade-in duration-700 transition-colors">
      
      {/* App Loading Overlay */}
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
        {/* Fix: Simplified class name for text color based on dark mode */}
        <h2 className={`text-3xl md:text-6xl font-['Raleway'] font-extrabold uppercase tracking-[0.1em] drop-shadow-2xl
                        ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Become a Wing Mentor
        </h2>
        {/* Fix: Simplified class name for text color based on dark mode */}
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

        <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center ${isMuted ? 'pointer-events-none' : 'pointer-events-auto'}">
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
      
      <div className="w-full py-16 md:py-24 bg-black border-y border-zinc-900">
        <div 
            className="cursor-pointer flex flex-col items-center justify-center space-y-4 select-none mb-20" 
            onClick={handleScrollClick}
        >
            <div className="w-full flex justify-center">
                 <span className="text-center text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-[0.3em] font-['Raleway'] mr-[-0.3em]">
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
        
        {/* App Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-8">
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
                        className="w-full h-full p-6 text-center rounded-xl transition-all duration-300 focus:outline-none group relative"
                      >
                        <div className={`flex items-center justify-center w-28 h-28 md:w-40 md:h-40 mx-auto mb-6 
                                        ${feature.image ? 'rounded-3xl border-0 shadow-2xl' : 'rounded-full border border-zinc-800'} 
                                        bg-zinc-900 text-yellow-500 transition-all duration-500 overflow-hidden relative shadow-lg
                                        ${!feature.image ? 'group-hover:bg-yellow-500 group-hover:text-black' : ''}`}>
                          {feature.image ? (
                              <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                              <i className={`fas ${feature.icon} text-5xl md:text-6xl transition-transform duration-300 group-hover:rotate-12`}></i>
                          )}
                        </div>
                        {/* Title removed, keeping only description */}
                        <p className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300
                                      ${isHovered ? 'text-white' : 'text-zinc-500'}`}>
                            {feature.description}
                        </p>
                      </button>
                  </div>
                </RevealOnScroll>
            );
          })}
        </div>
      </div>

      {/* NEW SECTION: About WingMentor Program - Replaced with PilotsStory Scroll */}
      <PilotsStory />

      {/* NEW SECTION: How We Fill The Aviation Low Timer Pilot Gap */}
      <div 
        id="how-we-fill-gap-section"
        className="w-full bg-black"
      >
        {/* Black Strip for Titles and instructions */}
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
                <RevealOnScroll delay={200}>
                  <p className="text-center text-zinc-500 text-xs mt-12 uppercase tracking-widest animate-pulse relative z-10">
                    Hover over nodes to reveal details • Click nodes to unfold the story
                  </p>
                </RevealOnScroll>
            </div>
        </div>

        {/* MindMap Section - background is now handled inside MindMap component */}
        <div className="w-full relative pb-24 px-6 flex flex-col items-center justify-center">
            <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
                {/* New Vertical Branching MindMap */}
                <MindMap />
                {/* End of MindMap integration */}

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

      {/* NEW SECTION: About WingMentor Program */}
      <div 
        id="about-program-overview-section"
        className={`w-full relative py-24 px-6 flex flex-col items-center justify-center transition-colors duration-500
                    ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-100 text-black'} border-y ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}
      >
          <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5" style={{ backgroundImage: `url(${images.MINDMAP_SECTION_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className={`absolute inset-0 z-0 ${isDarkMode ? 'bg-black/80' : 'bg-zinc-100/80'}`}></div>


          <div className="relative z-10 max-w-5xl mx-auto text-center">
              <RevealOnScroll>
                  <div className="flex justify-center mb-6">
                      <img src={images.LOGO} alt="Wing Mentor Logo" className={`w-32 h-auto object-contain ${isDarkMode ? 'filter brightness-0 invert' : ''}`} />
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      WingMentor Program & Apps
                  </h2>
                  <p className={`text-xl md:text-2xl leading-relaxed mb-12 ${textHighlight}`}>
                      Transforming Low-Time Pilots into Verifiable Assets.
                  </p>
              </RevealOnScroll>

              {/* REPLACED: Benefit Cards with Detailed Description & Image */}
              <RevealOnScroll delay={100} className="max-w-4xl mx-auto mb-16 text-left">
                  
                  {/* Moved Image to top of section as requested */}
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
                          The WingMentor program creates a symbiotic environment where both mentor and mentee gain valuable experience. Every logged mentor session is another tangible step towards your program goals. Within the WingMentor framework, you will assess and learn how to understand and assess mentees on their decision-making thinking—whether it is in a simulator practice session or analyzing complex <span className="font-bold text-yellow-500">IFR approach charts</span>.
                      </p>
                      <p>
                          The more detailed the session, the more profound the Crew Resource Management (CRM) skills you gain. You are building capability not just as a mentor, but as a pilot who can expertly consult and assess problem-solving skills in high-stakes environments.
                      </p>
                  </div>
              </RevealOnScroll>

              {/* NEW SECTION: Differentiation Image & Text */}
              <RevealOnScroll delay={200} className="max-w-4xl mx-auto mb-16 text-left">
                  {/* Title */}
                  <h3 className={`text-2xl md:text-3xl font-bold brand-font uppercase mb-6 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Differentiation: Flight Instructor vs Wing Mentor Consultancy Approach
                  </h3>

                  {/* The Image */}
                  <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-zinc-700/50 mb-8 group relative">
                      <img 
                          src={images.INSTRUCTION_VS_CONSULTANCY_IMG}
                          alt="Instruction vs Consultancy" 
                          className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                  </div>

                  {/* The Text Content - Box Removed */}
                  <div className={`text-lg leading-relaxed space-y-6 font-light ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                      <p>
                          It is crucial to understand the distinction: <span className="font-bold text-yellow-500">We do not teach lectures or seminars.</span> It is not our role to teach initial concepts or replace your flight school's curriculum. Instead, our mission is to <span className="font-bold">support and consult</span> based on your specific performance within your education and flight training in the aviation industry.
                      </p>
                      <p>
                          Whether you are a <span className="font-bold">student pilot</span> struggling with a specific maneuver, a <span className="font-bold">flight instructor</span> looking to refine your briefing techniques, or a <span className="font-bold">pilot returning after 10 years</span> who needs a skills refresher to get back in the cockpit—this is where WingMentor comes in. We analyze your performance gaps and provide the targeted consultation needed to bridge them.
                      </p>
                  </div>
              </RevealOnScroll>

              {/* NEW SECTION: The Wing Mentor Approach Chart - Simplified Bullet Design */}
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

                      <div className={`mt-8 pt-4 border-t ${isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-500'}`}>
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
                      <p>
                          For the <strong className={textHighlight}>Mentee</strong>, your path is one of guided growth. Your mission is to absorb, learn, and overcome challenges with the support of a dedicated mentor. Upon successful enrollment and a vetting interview, you gain access to the <strong>Wing Mentor Knowledge Vault</strong>—our comprehensive library of resources including study materials for PPL, CPL, IR, and ME ratings. This is about building a deep, practical understanding that prepares you for your next lesson and instills the confidence to command a career.
                      </p>
                  </div>

                  {/* New iPad Apps Section */}
                  <div className="my-16">
                    <img src={images.IPAD_APPS_IMG} alt="WingMentor App Suite" className="max-w-3xl mx-auto w-full h-auto object-contain rounded-xl shadow-2xl" />
                    <p className={`text-lg leading-relaxed mt-8 max-w-3xl mx-auto ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Your digital command center. The WingMentor suite of applications provides seamless access to all program resources, from logging mentorship hours to accessing critical flight knowledge, all from a single, integrated platform.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                        <div className={`p-6 rounded-lg border text-left ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/70 border-zinc-200'} flex items-center gap-x-6`}>
                            <img src={images.WINGMENTOR_PASSPORT_APP_IMG} alt="WingMentor App Icon" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg brand-font uppercase mb-2">WingMentor App</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>The central hub for your mentorship journey. Access your digital passport, track milestones, and navigate all program features from one intuitive interface.</p>
                            </div>
                        </div>
                        <div className={`p-6 rounded-lg border text-left ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/70 border-zinc-200'} flex items-center gap-x-6`}>
                            <img src={images.LOGBOOK_IMG} alt="WingLogs App Icon" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg brand-font uppercase mb-2">WingLogs</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>Your verifiable proof of experience. A digital logbook designed to meticulously document every consultation session, providing a credible record of your skills for future employers.</p>
                            </div>
                        </div>
                        <div className={`p-6 rounded-lg border text-left ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/70 border-zinc-200'} flex items-center gap-x-6`}>
                            <img src={images.PILOT_GAP_FORUM_APP_IMG} alt="The Pilot Gap Forum App Icon" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg brand-font uppercase mb-2">The Pilot Gap Forum</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>The intelligence hub of our community. Engage in critical discussions, share real-world insights, and connect with peers and senior mentors to navigate industry challenges.</p>
                            </div>
                        </div>
                        <div className={`p-6 rounded-lg border text-left ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/70 border-zinc-200'} flex items-center gap-x-6`}>
                             <img src={images.BLACK_BOX_APP_IMG} alt="The Black Box App Icon" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                             <div>
                                <h4 className="font-bold text-lg brand-font uppercase mb-2">The Black Box</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>The ultimate knowledge vault. Gain exclusive access to a comprehensive library of study materials, checkride preparations, and deeply guarded industry information for all pilot ratings.</p>
                             </div>
                        </div>
                    </div>
                  </div>

                  <button 
                      onClick={onGoToOperatingHandbook}
                      className={`px-10 py-4 rounded-full tracking-widest text-lg font-bold transition-all shadow-xl
                                  ${isDarkMode 
                                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                                      : 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-200'}`}
                  >
                      Read The Handbook <i className="fas fa-book-open ml-3"></i>
                  </button>
              </RevealOnScroll>
          </div>
      </div>

      <div 
        ref={programPageRef} 
        id="program-section"
        className="w-full min-h-[180vh] relative flex flex-col items-center py-24 px-6 border-b border-zinc-200 dark:border-zinc-900 bg-cover bg-center" 
        style={{ backgroundImage: `url(${images.PROGRAM_BG})` }}
      >
        <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-out 
                           ${isDarkMode ? 'bg-black' : 'bg-white'}
                           ${programPageVisible ? 'opacity-70 dark:opacity-70' : 'opacity-100 dark:opacity-100'}`}></div> 
        
        <div className={`relative z-10 w-full max-w-6xl mx-auto p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl transition-all duration-500
                        ${isDarkMode ? 'bg-black/70 border border-zinc-700' : 'bg-white/80 border border-zinc-300 backdrop-blur-lg'}`}>

            {/* Fixed: Added RevealOnScroll component */}
            <RevealOnScroll className="max-w-5xl mx-auto text-center mb-16 pt-8">
                <div className={`flex justify-center mb-8 backdrop-blur-sm p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-black/50' : 'bg-white/70 border border-zinc-200'}`}>
                    <img 
                        src={images.PROGRAM_HEADER_IMAGE} 
                        alt="Program Header Graphic" 
                        className="w-64 md:w-80 h-auto object-contain" 
                    />
                </div>
                
                <div className={`p-6 rounded-xl shadow-lg backdrop-blur-sm ${isDarkMode ? 'bg-black/50' : 'bg-white/70 border border-zinc-200'}`}> 
                    <h2 className={`text-4xl md:text-6xl font-bold brand-font leading-none mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}> 
                        Wing Mentorship Program
                    </h2>
                    <h3 className={`text-xl md:text-2xl font-light uppercase tracking-widest ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}> 
                        Bridging the experience gap <br />
                        <span className="inline-flex items-center gap-x-2 align-middle mt-2">
                            Low timer
                            <img 
                                src={images.RUNWAY_HOLDING_POINT} 
                                alt="to"
                                className="w-8 h-8 md:w-10 md:h-10 object-contain"
                                style={{ filter: isDarkMode ? 'invert(0)' : 'brightness(0.5)' }} 
                            />
                            wing mentor
                        </span>
                    </h3>
                </div>
            </RevealOnScroll>

            {/* Fixed: Added RevealOnScroll component */}
            <RevealOnScroll delay={100} className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
                <button 
                  onClick={onGoToProgramDetail}
                  className={`
                    w-48 h-48 p-4
                    border-4 rounded-2xl 
                    flex flex-col items-center justify-center
                    transition-all duration-300 
                    bg-red-700 hover:bg-red-600
                    text-white uppercase font-black text-center
                    animate-master-switch-pulse
                    ${isDarkMode ? 'border-zinc-300' : 'border-zinc-400'}
                  `}
                  aria-label="Become a Wing Mentor or Mentee and Start Now"
                >
                    <span className="block text-base leading-tight tracking-wider">
                        Become Wing Mentor/Mentee
                    </span>
                    <div className="w-3/4 h-px bg-white/50 my-3"></div>
                    <span className="block text-2xl leading-none tracking-widest">
                        Start Now
                    </span>
                </button>
                <p className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Press the red master switch to learn more about the program
                </p>
            </RevealOnScroll>

            {/* Fixed: Added RevealOnScroll component */}
            <RevealOnScroll delay={200} className="max-w-4xl mx-auto text-center mb-20">
                <p className={`text-xl md:text-2xl font-light leading-relaxed notam-font 
                               ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                    The Wing Mentorship Program is specifically designed for newly commercial and low-timer pilots seeking direction in their careers. Recognizing the aviation industry's need for experience where pilot-centric internships are scarce, we offer a unique peer-to-peer consultation and preparation platform. Our core mission is to help mentees assess and address specific flight-related challenges, refining their skills for upcoming lessons, rather than providing traditional instruction. Mentors, all commercially licensed ground instructors, gain invaluable, verifiable experience through a comprehensive logbook system, providing documented proof of their support across various pilot levels. This program is your pathway to building essential communication and leadership skills, setting you apart in the aviation industry.
                </p>
            </RevealOnScroll>

            {/* Fixed: Added RevealOnScroll component */}
            <RevealOnScroll delay={300} className="max-w-5xl mx-auto mt-16 mb-20">
              <div className={`w-full aspect-video rounded-xl overflow-hidden shadow-2xl border transition-colors duration-300
                              ${isDarkMode ? 'border-zinc-700 bg-black/50' : 'border-zinc-300 bg-white/70'}`}>
                <video 
                    className="w-full h-full object-cover" 
                    src={images.HERO_VIDEO} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    poster={images.HERO_POSTER}
                >
                    Your browser does not support the video tag.
                </video>
              </div>
            </RevealOnScroll>

        </div>
      </div>

      <div 
        id="why-wing-mentor-section"
        className={`w-full relative py-24 px-6 flex flex-col items-center justify-center transition-colors duration-500
                    ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'}`}>
        {/* Fixed: Added RevealOnScroll component */}
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
                  {/* About Us Page Header Image */}
                  <div className={`flex justify-center mb-8 backdrop-blur-sm p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-black/50' : 'bg-white/70 border border-zinc-200'}`}>
                      <img 
                          src={images.ABOUT_US_HEADER_IMAGE} 
                          alt="About Us Header Graphic" 
                          className="w-64 md:w-80 h-auto object-contain" 
                          /* Removed the style filter for dark mode */
                      />
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest
                                  ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      About Wing Mentor
                  </h2>
                </RevealOnScroll>
                <div className={`w-32 h-1 mx-auto ${isDarkMode ? 'bg-red-600' : 'bg-red-500'}`}></div>
            </div>

            <div className="mb-24">
                {/* Fixed: Added RevealOnScroll component */}
                <RevealOnScroll className="mb-16">
                  <h3 className={`text-3xl md:text-4xl font-bold brand-font uppercase text-center tracking-widest
                                ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      Meet The Founders
                  </h3>
                </RevealOnScroll>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* Fixed: Added RevealOnScroll component */}
                    <RevealOnScroll delay={100} className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border
                                    ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-yellow-600/50' : 'bg-white/70 border-zinc-200 hover:border-blue-400'}`}>
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

                    {/* Fixed: Added RevealOnScroll component */}
                    <RevealOnScroll delay={200} className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 border
                                    ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-yellow-600/50' : 'bg-white/70 border-zinc-200 hover:border-blue-400'}`}>
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

      {/* Footer Section */}
      <footer id="contact-us-section" className="bg-black border-t border-zinc-900 pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="space-y-6">
                <div className="flex items-center space-x-3">
                    <img src={images.LOGO} alt="Wing Mentor Logo" className="w-12 h-12 object-contain filter brightness-0 invert opacity-90" />
                    <span className="text-xl font-bold brand-font text-white uppercase tracking-widest">Wing Mentor</span>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
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

            {/* Contact Column */}
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

            {/* Status Column */}
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
