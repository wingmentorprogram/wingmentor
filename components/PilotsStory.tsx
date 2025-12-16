
import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';

export const PilotsStory: React.FC = () => {
  const { config } = useConfig();
  const { images } = config;
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const starterMenteeRef = useRef<HTMLDivElement>(null); // Ref to trigger animation
  
  // Consolidated state for performance
  const [storyState, setStoryState] = useState({
    progress: 0,
    planeX: 150, // Starting coordinates based on path "M 150 50"
    planeY: 50,
    planeAngle: 0
  });

  const PLANE_ICON = "https://lh3.googleusercontent.com/d/1LBUmOl-u3czx1hLf1NTgPrTnc9Gf1d1z";

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !pathRef.current || !starterMenteeRef.current) return;
      
      const elementHeight = scrollRef.current.getBoundingClientRect().height;
      const starterMenteeRect = starterMenteeRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate raw progress based on the starter mentee's position.
      // Animation starts when the starter mentee section enters the viewport.
      let rawProgress = (windowHeight - starterMenteeRect.top) / elementHeight;
      
      // Clamp raw progress between 0 and 1
      rawProgress = Math.max(0, Math.min(1, rawProgress));

      // Apply a constant fast speed curve to the progress
      let progress = rawProgress * 1.5;

      // Final animation progress is clamped to 1
      progress = Math.min(1, progress);
      
      // Calculate Plane Position and Rotation
      const path = pathRef.current;
      const totalLen = path.getTotalLength();
      const currentLen = totalLen * progress;
      const point = path.getPointAtLength(currentLen);
      
      // Calculate angle for rotation (look ahead/behind for tangent)
      const lookAhead = 2; 
      let p1 = point;
      let p2 = point;
      
      if (currentLen < totalLen - lookAhead) {
          p2 = path.getPointAtLength(currentLen + lookAhead);
          // Standard atan2
      } else {
          // At end of path, look backward to maintain angle
          p1 = path.getPointAtLength(currentLen - lookAhead);
          p2 = point;
      }
      
      // Calculate angle in degrees
      // Standard math calculates 0 deg as East (Right). 
      // If the plane icon points right by default, no adjustment needed.
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);

      setStoryState({
        progress,
        planeX: point.x,
        planeY: point.y,
        planeAngle: angle
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set state correctly on mount
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full relative bg-[#e3d0a6] overflow-hidden">
        {/* Container for the scroll animation */}
        <div 
            ref={scrollRef}
            className="relative w-full"
        >
            {/* The Map Background - Parallax Effect */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ 
                    backgroundImage: `url(${images.STORY_MAP_BG})`,
                    backgroundSize: 'cover',
                    // Parallax: Moves background position based on scroll.
                    // As progress goes 0 -> 1, background moves to create opposite motion effect
                    backgroundPosition: `50% ${storyState.progress * 100}%`,
                    transition: 'background-position 0.1s linear',
                    filter: 'blur(2px)'
                }}
            />

            {/* Paper Overlay - Solid Opacity 100% with Blend Mode */}
            <img 
                src={images.STORY_PAPER_OVERLAY}
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-multiply z-0 opacity-100"
            />
            
            {/* --- CONTENT --- */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-6 py-32">
                
                {/* Header Title with "Ink" look */}
                <div className="text-center mb-24 flex flex-col items-center">
                    <img 
                        src={images.LOGO} 
                        alt="Wing Mentor Logo" 
                        className="w-40 h-40 md:w-64 md:h-64 object-contain mb-8 filter drop-shadow-lg"
                    />
                    <h2
                        className="text-4xl md:text-7xl font-['Playfair_Display',_serif] font-bold text-[#3e2b1e] tracking-wider drop-shadow-md"
                        style={{
                            textShadow: '2px 2px 0px rgba(255,255,255,0.5)'
                        }}>
                        Wing Mentor
                    </h2>
                    <p
                        className="text-2xl md:text-4xl font-['Playfair_Display',_serif] font-light text-[#4a3b2a] tracking-[0.3em] uppercase drop-shadow-sm mt-2"
                        style={{
                            textShadow: '1px 1px 0px rgba(255,255,255,0.3)'
                        }}>
                        Program Plan
                    </p>
                </div>

                {/* STORY PATH CONTAINER */}
                <div className="relative w-full max-w-3xl">
                    
                    {/* SVG Container for Path & Line (BEHIND CONTENT) */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" style={{ height: '100%', minHeight: '1200px' }} preserveAspectRatio="none">
                        <defs>
                            <mask id="line-mask">
                                <path 
                                    d="M 150 50 C 450 50, 650 200, 650 400 C 650 600, 250 700, 150 800 C 50 900, 150 1100, 350 1200" 
                                    fill="none" 
                                    stroke="white" 
                                    strokeWidth="15" 
                                    pathLength="1"
                                    strokeDasharray="1"
                                    strokeDashoffset={1 - storyState.progress} 
                                    strokeLinecap="round"
                                />
                            </mask>
                             {/* Reversed path for correcting text orientation on right-to-left curves */}
                            <path
                                id="flight-path-curve-reversed"
                                d="M 350 1200 C 150 1100, 50 900, 150 800 C 250 700, 650 600, 650 400 C 650 200, 450 50, 150 50"
                                fill="none"
                            />
                        </defs>
                        
                        {/* Reference Path for Calculations */}
                        <path 
                            id="flight-path-curve"
                            ref={pathRef}
                            d="M 150 50 C 450 50, 650 200, 650 400 C 650 600, 250 700, 150 800 C 50 900, 150 1100, 350 1200" 
                            fill="none" 
                            stroke="rgba(0,0,0,0.1)" // Very faint guide line
                            strokeWidth="4" 
                            strokeDasharray="15, 15"
                            strokeLinecap="round"
                        />

                        {/* Text along the path (TOP HALF) */}
                        <text dy="-15">
                            <textPath 
                                href="#flight-path-curve" 
                                startOffset="8%" 
                                className="fill-[#b91c1c] font-['Playfair_Display',_serif] text-sm md:text-lg font-bold tracking-[0.2em] opacity-80"
                            >
                                PATHWAY TO MENTOR
                            </textPath>
                            <textPath
                                href="#flight-path-curve"
                                startOffset="18%"
                                className="fill-black font-['Playfair_Display',_serif] text-sm md:text-lg font-bold tracking-[0.2em]"
                                style={{ opacity: storyState.progress > 0.15 ? 0.7 : 0, transition: 'opacity 0.5s ease-in-out' }}
                            >
                                • First Solo
                            </textPath>
                            <textPath
                                href="#flight-path-curve"
                                startOffset="26%"
                                className="fill-black font-['Playfair_Display',_serif] text-sm md:text-base font-semibold tracking-wider"
                                style={{ opacity: storyState.progress > 0.23 ? 0.7 : 0, transition: 'opacity 0.5s ease-in-out' }}
                            >
                                • Private Pilot License
                            </textPath>
                        </text>

                        {/* Text along the path (BOTTOM HALF) */}
                        <text dy="-25">
                            <textPath
                                href="#flight-path-curve-reversed"
                                startOffset="22%"
                                className="fill-black font-['Playfair_Display',_serif] text-sm md:text-base font-semibold tracking-wider"
                                style={{ opacity: storyState.progress > 0.75 ? 0.7 : 0, transition: 'opacity 0.5s ease-in-out' }}
                            >
                                • Commercial License
                            </textPath>
                            <textPath
                                href="#flight-path-curve-reversed"
                                startOffset="16%"
                                className="fill-black font-['Playfair_Display',_serif] text-sm md:text-base font-semibold tracking-wider"
                                style={{ opacity: storyState.progress > 0.82 ? 0.7 : 0, transition: 'opacity 0.5s ease-in-out' }}
                            >
                                • IFR Rated
                            </textPath>
                        </text>

                        {/* The Visible Red Dashed Line (Masked) */}
                        <path 
                            d="M 150 50 C 450 50, 650 200, 650 400 C 650 600, 250 700, 150 800 C 50 900, 150 1100, 350 1200" 
                            fill="none" 
                            stroke="#b91c1c" 
                            strokeWidth="4" 
                            strokeDasharray="15, 15"
                            strokeLinecap="round"
                            mask="url(#line-mask)"
                        />
                    </svg>
                    
                    {/* The Airplane Icon - in its own container for layering (ABOVE CONTENT) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
                        <img 
                            src={PLANE_ICON}
                            alt="Airplane navigating the flight path"
                            style={{
                                position: 'absolute',
                                width: 50,
                                height: 50,
                                left: `${storyState.planeX}px`,
                                top: `${storyState.planeY}px`,
                                transform: `translate(-50%, -50%) rotate(${storyState.planeAngle}deg)`,
                                filter: 'drop-shadow(3px 5px 2px rgba(0,0,0,0.3))',
                                opacity: storyState.progress > 0 ? 1 : 0,
                                transition: 'opacity 0.3s ease',
                                transformOrigin: 'center center'
                            }}
                        />
                    </div>

                    {/* STAGE 1: Starter Mentee (Top Left) */}
                    <div ref={starterMenteeRef} className="relative mb-4 flex flex-col justify-start items-center md:items-start pl-4 md:pl-10">
                        <div className="w-48 md:w-64 transform -rotate-2 group relative z-10">
                            <div className="text-center font-['Playfair_Display',_serif] text-2xl md:text-3xl font-bold text-[#4a3b2a] mb-3 italic tracking-wide drop-shadow-sm">
                                Starter Mentee
                            </div>
                            <div className="p-2 bg-[#fdfbf7] shadow-[5px_5px_15px_rgba(0,0,0,0.3)] border-2 border-[#8b7355] transform transition-transform group-hover:scale-105 duration-300 rotate-1">
                                <div className="overflow-hidden border border-[#d6c4a0]">
                                    <img src={images.STORY_STUDENT} alt="Starter Mentee" className="w-full h-auto" />
                                </div>
                            </div>
                            {/* Red Dot Marker */}
                            <div className="absolute top-1/2 right-[-20px] md:right-[-40px] w-6 h-6 bg-[#b91c1c] rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)] z-10 border-2 border-white"></div>
                        </div>

                        {/* Sticky Note Text for Starter Mentee - Positioned under the image */}
                        <div className="mt-8 max-w-xs relative z-20 group-hover:z-30 transition-all">
                             <div className="relative bg-[#fef3c7] p-6 shadow-[5px_10px_15px_rgba(0,0,0,0.3)] transform -rotate-1 border-b border-r border-[#d4c5a6]">
                                {/* Red Pin Visual */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 filter drop-shadow-md">
                                    <i className="fas fa-thumbtack text-2xl md:text-3xl text-red-600 rotate-[-15deg] shadow-red-900/50"></i>
                                </div>
                                
                                <p className="font-['Playfair_Display',_serif] text-[#4a3b2a] text-lg italic leading-relaxed text-center pt-2">
                                    "This is where you start in the WingMentor program. Reach the goal of 10 hrs with a mentor to get access to the Black Box where all pilot knowledge will help you through your pilot career."
                                </p>
                             </div>
                        </div>
                    </div>

                    {/* STAGE 3: Junior Mentor (Middle Right) */}
                    <div className="relative mb-56 flex flex-col items-end pr-4 md:pr-10">
                        <div className="w-48 md:w-64 transform rotate-2 relative group z-10">
                            {/* Red Dot Marker */}
                            <div className="absolute top-1/2 left-[-30px] md:left-[-50px] w-6 h-6 bg-[#b91c1c] rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)] border-2 border-white"></div>
                            
                            <div className="p-2 bg-[#fdfbf7] shadow-[5px_5px_15px_rgba(0,0,0,0.3)] border-2 border-[#8b7355] transform transition-transform group-hover:scale-105 duration-300 -rotate-2">
                                <div className="overflow-hidden border border-[#d6c4a0]">
                                    <img src={images.STORY_PPL} alt="Junior Mentor" className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="text-center font-['Playfair_Display',_serif] text-2xl md:text-3xl font-bold text-[#4a3b2a] mt-3 italic tracking-wide drop-shadow-sm">
                                Junior Mentor
                            </div>
                        </div>

                        {/* Sticky Note Text for Junior Mentor */}
                        <div className="mt-8 max-w-xs relative z-20 group-hover:z-30 transition-all">
                            <div className="relative bg-[#fef3c7] p-6 shadow-[5px_10px_15px_rgba(0,0,0,0.3)] transform rotate-1 border-b border-r border-[#d4c5a6]">
                                {/* Red Pin Visual */}
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 filter drop-shadow-md">
                                    <i className="fas fa-thumbtack text-2xl md:text-3xl text-red-600 rotate-[15deg] shadow-red-900/50"></i>
                                </div>
                                
                                <p className="font-['Playfair_Display',_serif] text-[#4a3b2a] text-lg italic leading-relaxed text-center pt-2">
                                    "After completing 20 hours of supervised mentorship, you shall gain the experience and valuable skills to become an official mentor."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STAGE 4: Official Wingmentor (Bottom Center) */}
                    <div className="relative mb-20 flex flex-col items-center justify-center px-4">
                        <div className="w-64 md:w-80 transform -rotate-1 relative group z-10">
                            <div className="text-center font-['Playfair_Display',_serif] text-2xl md:text-3xl font-bold text-[#4a3b2a] mb-3 italic tracking-wide drop-shadow-sm">
                                Official Wingmentor
                            </div>
                            <div className="p-2 bg-[#fdfbf7] shadow-[5px_5px_15px_rgba(0,0,0,0.3)] border-2 border-[#8b7355] transform transition-transform group-hover:scale-105 duration-300 rotate-2">
                                <div className="overflow-hidden border border-[#d6c4a0]">
                                    <img src={images.STORY_CPL} alt="Official Wingmentor" className="w-full h-auto" />
                                </div>
                            </div>
                                {/* Red Dot Marker */}
                                <div className="absolute top-1/2 right-[-20px] md:right-[-40px] w-6 h-6 bg-[#b91c1c] rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.4)] border-2 border-white"></div>
                        </div>

                        {/* Paragraph Description for Official Wingmentor */}
                        <div className="mt-12 max-w-3xl relative z-20 text-center">
                            <div className="relative bg-[#fdfbf7]/70 backdrop-blur-sm p-8 rounded-lg border border-[#d6c4a0]/50 shadow-lg">
                                <p className="font-['Playfair_Display',_serif] text-[#3e2b1e] text-xl md:text-2xl leading-relaxed">
                                    Official Wingmentor status is granted at the 20th hour. Upon completing your 50th hour, you will be awarded a program completion certificate. This journey equips you with invaluable hands-on experience, consulting problem-solving skills, Crew Resource Management, and verified logged hours. You'll have the leverage to confidently state in job interviews, 'I have supported and guided X pilots,' setting you apart from other flight instructor applicants.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COMIC STRIP SECTION: BECOMING A WING MENTOR */}
                <div className="w-full mt-16 border-t-4 border-dashed border-[#8a1c1c]/40 pt-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-['Playfair_Display',_serif] italic text-[#3e2b1e] mb-12 drop-shadow-sm" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.5)' }}>
                        Becoming a Wing Mentor
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4">
                        {/* Panel 1 */}
                        <div className="bg-white border-4 border-black p-2 shadow-[10px_10px_0px_rgba(0,0,0,0.2)] transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                            <div className="border-2 border-black h-48 overflow-hidden bg-gray-100">
                                <img src={images.STORY_MENTOR_1} alt="Mentor Meeting" className="w-full h-full object-cover contrast-125 transition-all duration-500" />
                            </div>
                            <p className="font-['Comic_Neue',_cursive] font-bold text-lg mt-3 uppercase tracking-wider text-black">"Guidance & Strategy"</p>
                        </div>

                        {/* Panel 2 */}
                        <div className="bg-white border-4 border-black p-2 shadow-[10px_10px_0px_rgba(0,0,0,0.2)] transform rotate-[2deg] hover:rotate-0 transition-transform duration-300 relative -top-6 md:top-0 z-10">
                            <div className="border-2 border-black h-48 overflow-hidden bg-gray-100">
                                <img src={images.STORY_MENTOR_2} alt="Logbook Verification" className="w-full h-full object-cover contrast-125 transition-all duration-500" />
                            </div>
                            <p className="font-['Comic_Neue',_cursive] font-bold text-lg mt-3 uppercase tracking-wider text-black">"Verifiable Experience"</p>
                        </div>

                        {/* Panel 3 */}
                        <div className="bg-white border-4 border-black p-2 shadow-[10px_10px_0px_rgba(0,0,0,0.2)] transform rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
                            <div className="border-2 border-black h-48 overflow-hidden bg-gray-100">
                                <img src={images.STORY_MENTOR_3} alt="Interview Leverage" className="w-full h-full object-cover contrast-125 transition-all duration-500" />
                            </div>
                            <p className="font-['Comic_Neue',_cursive] font-bold text-lg mt-3 uppercase tracking-wider text-black">"Interview Leverage with Experience"</p>
                        </div>
                    </div>

                    <div className="mt-16 max-w-2xl mx-auto relative bg-[#fdfbf7]/80 p-6 rounded-xl border border-[#d6c4a0] shadow-sm backdrop-blur-sm">
                        {/* Decorative Quotes */}
                        <span className="absolute -top-4 -left-4 text-6xl text-[#8a1c1c] opacity-30 font-serif">“</span>
                        <p className="font-['Playfair_Display',_serif] text-xl md:text-2xl text-[#4a3b2a] italic leading-relaxed px-4">
                            Walk into an interview not just with a license, but with the leverage to say, 'I have supported and guided X amount of pilots in various stages (CPL, PPL, SPL), with verified logged hours of support and guidance through the Wing Mentor program.'
                        </p>
                        <span className="absolute -bottom-12 -right-4 text-6xl text-[#8a1c1c] opacity-30 font-serif">”</span>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
