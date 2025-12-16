






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
    { icon: 'fa-book-open', title: 'Operating Handbook', description: 'Access the official Program Operating Handbook.', target: 'handbook' },
    { icon: 'fa-terminal', title: 'Examination Terminal', description: 'Prepare for checkrides and knowledge tests.', target: 'examination' },
    { icon: 'fa-exclamation-triangle', title: 'Pilot Gap Forum', description: 'Discuss industry challenges with peers and mentors.', target: 'gap' },
    { icon: 'fa-box-open', title: 'The Black Box', description: 'Unlock deeply guarded information and resources.', target: 'blackbox' },
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
  };

  const textHighlight = isDarkMode ? 'text-blue-400' : 'text-blue-600';

  return (
    <div className="relative pt-32 min-h-screen bg-white dark:bg-black flex flex-col animate-in fade-in duration-700 transition-colors">
      
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
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-8">
          {ACTION_ICONS.map((feature, index) => (
            <RevealOnScroll key={feature.target} delay={index * 100}>
              <button
                onClick={() => handleIconClick(feature.target)}
                className="w-full h-full p-6 text-center rounded-xl transition-all duration-300 hover:bg-zinc-900 hover:-translate-y-2 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-black ring-yellow-500 group"
              >
                <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-500 transition-colors duration-300 group-hover:bg-yellow-500 group-hover:text-black">
                  <i className={`fas ${feature.icon} text-2xl md:text-3xl`}></i>
                </div>
                <h4 className="font-bold text-sm md:text-base uppercase tracking-wider text-white mb-2">{feature.title}</h4>
                <p className="text-xs text-zinc-400">{feature.description}</p>
              </button>
            </RevealOnScroll>
          ))}
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
                  <h2 className={`text-4xl md:text-5xl font-bold brand-font uppercase tracking-widest mb-4 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      About The WingMentor Program
                  </h2>
                  <p className={`text-xl md:text-2xl leading-relaxed mb-12 ${textHighlight}`}>
                      Transforming Low-Time Pilots into Verifiable Assets.
                  </p>
              </RevealOnScroll>

              {/* Benefit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  <RevealOnScroll delay={100} className={`p-8 rounded-xl border transition-all duration-300 hover:-translate-y-2
                                          ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-blue-500/50' : 'bg-white/70 border-zinc-200 hover:border-blue-400'}`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-900/20 text-blue-400 border border-blue-500/30`}>
                          <i className="fas fa-file-signature text-2xl"></i>
                      </div>
                      <h3 className={`text-xl font-bold brand-font uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Verifiable Experience</h3>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          Go beyond flight hours. Our structured program documents your mentorship, leadership, and problem-solving skills in a verifiable logbook.
                      </p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={200} className={`p-8 rounded-xl border transition-all duration-300 hover:-translate-y-2
                                          ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-blue-500/50' : 'bg-white/70 border-zinc-200 hover:border-blue-400'}`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-900/20 text-blue-400 border border-blue-500/30`}>
                          <i className="fas fa-users-cog text-2xl"></i>
                      </div>
                      <h3 className={`text-xl font-bold brand-font uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Hands-On Consultation</h3>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          Act as a consultant, not just an instructor. Diagnose issues from real flight debriefs and provide targeted, effective guidance to fellow pilots.
                      </p>
                  </RevealOnScroll>
                  <RevealOnScroll delay={300} className={`p-8 rounded-xl border transition-all duration-300 hover:-translate-y-2
                                          ${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 hover:border-blue-500/50' : 'bg-white/70 border-zinc-200 hover:border-blue-400'}`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-900/20 text-blue-400 border border-blue-500/30`}>
                          <i className="fas fa-trophy text-2xl"></i>
                      </div>
                      <h3 className={`text-xl font-bold brand-font uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>Competitive Advantage</h3>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          Enter interviews with a portfolio of success. Demonstrate the command authority and CRM skills that airlines are looking for.
                      </p>
                  </RevealOnScroll>
              </div>

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
