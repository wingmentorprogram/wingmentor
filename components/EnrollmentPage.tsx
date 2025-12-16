import React, { useRef, useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext'; // Import useConfig
import { useTheme } from '../context/ThemeContext';

interface EnrollmentPageProps {
  onBackToProgramDetail: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${className}`}
    >
      {children}
    </div>
  );
};

const TermsModal: React.FC<{ onClose: () => void, isDarkMode: boolean }> = ({ onClose, isDarkMode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
        <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]
                         ${isDarkMode ? 'bg-zinc-900 border border-zinc-700' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center
                            ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
                <h3 className="text-xl font-bold brand-font text-red-700 uppercase tracking-wider">Terms & Conditions</h3>
                <button onClick={onClose} className={`transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'}`}>
                    <i className="fas fa-times text-xl"></i>
                </button>
            </div>
            <div className={`p-8 overflow-y-auto notam-font text-sm leading-relaxed space-y-4
                            ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                <p className="font-bold">Please read carefully before enrolling.</p>
                
                <h4 className={`font-bold uppercase border-b pb-1 mt-4 ${isDarkMode ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>1. Nature of Service</h4>
                <p>Wing Mentorship is strictly a peer-to-peer support, guidance, and consultation community. We are <span className="font-bold text-red-600">NOT</span> a flight school, Approved Training Organization (ATO), or certified flight training provider. We do not provide flight instruction, ground school credit, or endorsements for any aviation licenses (FAA, ICAO, etc.).</p>
                
                <h4 className={`font-bold uppercase border-b pb-1 mt-4 ${isDarkMode ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>2. Consultation Only - No Instruction</h4>
                <p>All information, guidance, and advice provided by Wing Mentors is for mentorship and supplemental understanding only. It does not replace, supersede, or constitute official instruction from a Certified Flight Instructor (CFI/FI) or an authorized training facility. Users are responsible for verifying all information with their official flight instructors.</p>
                
                <h4 className={`font-bold uppercase border-b pb-1 mt-4 ${isDarkMode ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>3. Limitation of Liability</h4>
                <p>Wing Mentorship, its founders, mentors, and affiliates are not liable for any academic failures, flight test failures, incidents, accidents, regulatory violations, or financial losses incurred by the member. The user assumes full responsibility for the safety and legality of their flight operations.</p>
                
                <h4 className={`font-bold uppercase border-b pb-1 mt-4 ${isDarkMode ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>4. Non-Interference with Flight Schools</h4>
                <p>This program is designed to supplement your existing training. We respect the authority of your current flight school and instructors. Our guidance is intended to help you prepare for your official lessons, not to contradict them.</p>
                
                <h4 className={`font-bold uppercase border-b pb-1 mt-4 ${isDarkMode ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>5. Mentor Accountability</h4>
                <p>Junior Wing Mentors are trainees in a supervised program. While we verify logs and assess performance, Wing Mentorship does not guarantee the teaching proficiency of any mentor beyond the scope of peer support.</p>
                
                <h4 className={`font-bold uppercase border-b pb-1 mt-4 ${isDarkMode ? 'text-white border-zinc-700' : 'text-zinc-800 border-zinc-200'}`}>6. Indemnification</h4>
                <p>By enrolling, you agree to indemnify, defend, and hold harmless Wing Mentorship from any claims, damages, lawsuits, or legal actions arising out of your participation in this program or reliance on information provided herein.</p>
            </div>
            <div className={`p-6 border-t text-right ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-200 bg-zinc-50'}`}>
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-black text-white font-bold rounded hover:bg-zinc-800 transition-colors uppercase tracking-wider text-sm"
                >
                    I Understand
                </button>
            </div>
        </div>
    </div>
);

export const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ onBackToProgramDetail, isLoggedIn, onLogin }) => {
  const { isDarkMode } = useTheme();
  const { config } = useConfig();
  const { images } = config;

  const [selectedRole, setSelectedRole] = useState<'mentee' | 'mentor' | null>(null);
  const [flightSchool, setFlightSchool] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); 
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false); 
  const [showTerms, setShowTerms] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const countries = [
    "Philippines",
    "Germany",
    "Mauritius",
    "United Arab Emirates",
    "United Kingdom"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      if (!isLoggedIn) {
        onLogin(); 
      }
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className={`relative min-h-screen animate-in fade-in duration-700 flex items-center justify-center
                       ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
         <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={images.ABOUT_BG} 
              alt="Background" 
              className="w-full h-full object-cover object-center" 
              style={{ filter: 'brightness(60%) blur(2px)' }} 
            />
            <div className={`absolute inset-0 z-10 ${isDarkMode ? 'bg-black/60' : 'bg-white/80'}`}></div>
         </div>
         
         <div className={`relative z-20 max-w-2xl mx-auto p-12 rounded-xl shadow-2xl text-center border
                          ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-white'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6
                             ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <i className="fas fa-check text-4xl text-green-600"></i>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold brand-font mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Application Received</h2>
            <h3 className={`text-xl font-bold text-red-600 uppercase tracking-widest mb-4`}>Next Step: The Vetting Interview</h3>
            <p className={`text-lg notam-font mb-8 leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                To unlock the <strong>Wing Mentor Knowledge Vault</strong> and receive full support (including free access to PPL, CPL, IR, & ME resources), you must complete a vetting interview. We grant access only to those truly dedicated to the craft. Expect a call shortly.
            </p>
            <button 
                onClick={onBackToProgramDetail}
                className="px-8 py-3 bg-black text-white font-bold rounded hover:bg-zinc-800 transition-colors uppercase tracking-widest"
            >
                Return to Program Details
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen animate-in fade-in duration-700 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} isDarkMode={isDarkMode} />}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={images.ABOUT_BG} 
          alt="Enrollment Background" 
          className="w-full h-full object-cover object-center" 
          style={{
            filter: 'brightness(60%) blur(2px)', 
            pointerEvents: 'none'
          }} 
        />
        <div className={`absolute inset-0 z-10 ${isDarkMode ? 'bg-black/60' : 'bg-white/80'}`}></div>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto pt-32 pb-16 px-6 lg:px-12">
        <RevealOnScroll className="mb-12 text-center">
            <button 
                onClick={onBackToProgramDetail}
                className={`flex items-center mx-auto space-x-3 px-6 py-3 rounded-md uppercase tracking-widest text-sm font-bold transition-all shadow-md
                            border ${isDarkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-600' : 'bg-white text-zinc-800 hover:bg-zinc-100 border-zinc-300'}`}>
                <i className="fas fa-arrow-left"></i>
                <span>Back to Program Details</span>
            </button>
        </RevealOnScroll>

        <RevealOnScroll className="text-center mb-16">
          <h1 className={`text-5xl md:text-7xl font-bold brand-font leading-tight mb-4
                          ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
            Enroll in Wing Mentorship
          </h1>
          <p className={`text-xl md:text-3xl font-light leading-relaxed
                         ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Your Journey to Aviation Excellence Starts Here.
          </p>
        </RevealOnScroll>

        <div className={`space-y-16 mt-20 p-8 md:p-12 rounded-xl shadow-md transition-all duration-500 border
                        ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-white'}`}>
          
          <RevealOnScroll delay={100}>
            <h2 className={`text-3xl md:text-4xl font-bold brand-font mb-6 text-center
                           ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>
              Choose Your Path
            </h2>
            <p className={`text-lg md:text-xl leading-relaxed notam-font
                           ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
              The Wing Mentorship Program offers two distinct pathways to participate, whether you're seeking guidance as a mentee or looking to build your verifiable experience as a junior mentor. Both paths are designed to elevate your aviation career through unique support and development opportunities.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={200}>
            <h2 className={`text-3xl md:text-4xl font-bold brand-font mb-6 text-center
                           ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>
              Pathway 1: Enroll as a Mentee
            </h2>
            <div className="space-y-6">
                <p className={`text-lg md:text-xl leading-relaxed notam-font
                               ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                  As a mentee, you will gain access to our network of commercially licensed and ground instructor-certified Wing Mentors. Our program is tailored to help you:
                </p>
                <ul className={`list-disc list-inside ml-4 space-y-2 notam-font
                               ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                    <li>Receive one-on-one consultation on specific flight-related challenges.</li>
                    <li>Prepare for upcoming lessons and flights with certified instructors.</li>
                    <li>Overcome knowledge gaps and refine your practical understanding.</li>
                    <li>Connect with experienced aviators who understand your journey.</li>
                </ul>
                <p className={`text-lg md:text-xl leading-relaxed notam-font
                               ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                  You'll benefit from personalized guidance that focuses on problem-solving and strategic preparation, ensuring you approach your training with enhanced confidence and proficiency.
                </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300}>
            <h2 className={`text-3xl md:text-4xl font-bold brand-font mb-6 text-center
                           ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>
              Pathway 2: Become a Junior Wing Mentor
            </h2>
            <div className="space-y-6">
                <p className={`text-lg md:text-xl leading-relaxed notam-font
                               ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                  For low-timer commercial pilots and aspiring flight instructors, becoming a junior Wing Mentor offers an unparalleled opportunity. This pathway provides the "experience without experience" sought by the industry:
                </p>
                <ul className={`list-disc list-inside ml-4 space-y-2 notam-font
                               ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                    <li>Gain verifiable, logged experience in a supervised mentorship setting.</li>
                    <li>Develop crucial communication, guidance, and problem-solving skills.</li>
                    <li>Enhance your resume for flight school applications and interviews.</li>
                    <li>Contribute to the aviation community by supporting fellow pilots.</li>
                    <li>Receive assessment and feedback from Official Mentor Team Personnel during your initial program pathway.</li>
                </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={400}>
            <h2 className={`text-3xl md:text-4xl font-bold brand-font mb-6 text-center
                           ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>
              Enrollment Package Benefits
            </h2>
            <p className={`text-lg md:text-xl leading-relaxed notam-font
                           ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
              Upon joining the Wing Mentorship Program (for both mentees and junior mentors), your enrollment package includes essential tools and resources designed to support your aviation journey:
            </p>
            <ul className={`list-disc list-inside ml-4 space-y-2 notam-font
                           ${isDarkMode ? 'text-zinc-300' : 'text-black'}`}>
                <li><span className="font-bold">Exclusive Wing Mentor Apparel:</span> Show your pride and belonging.</li>
                <li><span className="font-bold">Access to Specialized Aviation Apps:</span> Enhance your flight planning, weather analysis, and navigation.</li>
                <li><span className="font-bold">Quizlet Study Materials:</span> Curated content for various pilot certifications and ratings.</li>
                <li><span className="font-bold">Examination Preparation:</span> Tailored knowledge prep based on your tier level.</li>
                <li><span className="font-bold">Simulation Support:</span> Ideal for Instrument Flight Rules (IFR) guidance and complex scenario practice.</li>
                <li><span className="font-bold">Community Support & Guidance:</span> Connect with a vibrant network of pilots at all levels.</li>
            </ul>
          </RevealOnScroll>

          <RevealOnScroll delay={500}>
            <div className={`mt-16 pt-16 border-t-2 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <h2 className={`text-3xl md:text-5xl font-bold brand-font mb-8 text-center uppercase
                                ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Begin Your Enrollment
                </h2>
                
                <form onSubmit={handleSubmit} className={`max-w-3xl mx-auto space-y-8 p-8 md:p-12 rounded-xl shadow-lg border
                                                          ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-50 border-zinc-200'}`}>
                    
                    {!isLoggedIn && (
                        <div className="space-y-6">
                            <h3 className={`text-xl font-bold text-red-700 brand-font uppercase tracking-wider border-b pb-2
                                            ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                                1. Create Account
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Username</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`w-full border p-4 rounded focus:outline-none focus:border-red-600 transition-colors
                                                    ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                                        placeholder="Pilot123"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full border p-4 rounded focus:outline-none focus:border-red-600 transition-colors
                                                    ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                                        placeholder="pilot@example.com"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className={`w-full border p-4 rounded focus:outline-none focus:border-red-600 transition-colors
                                                    ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full border p-4 rounded focus:outline-none focus:border-red-600 transition-colors
                                                    ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <h3 className={`text-xl font-bold text-red-700 brand-font uppercase tracking-wider border-b pb-2
                                        ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'}`}>
                            {isLoggedIn ? '1. Program Details' : '2. Program Details'}
                        </h3>
                        
                        <div>
                            <label className={`block text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Select Your Pathway</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label 
                                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                                    ${selectedRole === 'mentee' 
                                        ? 'border-red-600 bg-red-900/20' 
                                        : isDarkMode ? 'border-zinc-700 hover:border-red-800 bg-zinc-900' : 'border-zinc-200 hover:border-red-300 bg-white'}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value="mentee" 
                                        checked={selectedRole === 'mentee'}
                                        onChange={() => setSelectedRole('mentee')}
                                        className="w-5 h-5 text-red-600 focus:ring-red-500"
                                    />
                                    <div className="ml-3">
                                        <span className={`block font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Mentee</span>
                                        <span className={`block text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>I am seeking guidance & support</span>
                                    </div>
                                </label>

                                <label 
                                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                                    ${selectedRole === 'mentor' 
                                        ? 'border-red-600 bg-red-900/20' 
                                        : isDarkMode ? 'border-zinc-700 hover:border-red-800 bg-zinc-900' : 'border-zinc-200 hover:border-red-300 bg-white'}`}
                                >
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value="mentor" 
                                        checked={selectedRole === 'mentor'}
                                        onChange={() => setSelectedRole('mentor')}
                                        className="w-5 h-5 text-red-600 focus:ring-red-500"
                                    />
                                    <div className="ml-3">
                                        <span className={`block font-bold uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Junior Wing Mentor</span>
                                        <span className={`block text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>I want to build experience supporting others</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Current Flight School</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={flightSchool}
                                    onChange={(e) => setFlightSchool(e.target.value)}
                                    className={`w-full border p-4 rounded focus:outline-none focus:border-red-600 transition-colors
                                                ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                                    placeholder="e.g. Alpha Aviation Academy"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>Country</label>
                                <div className="relative">
                                    <select 
                                        required
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        className={`w-full border p-4 rounded focus:outline-none focus:border-red-600 transition-colors appearance-none
                                                    ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'}`}
                                    >
                                        <option value="" disabled>Select Country</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                    <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>
                                        <i className="fas fa-chevron-down text-xs"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 pb-2">
                        <label className="flex items-start space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 text-red-600 border-zinc-300 rounded focus:ring-red-500"
                            />
                            <span className={`text-sm leading-tight ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700'}`}>
                                I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-red-700 font-bold hover:underline">Terms and Conditions</button>. I acknowledge that Wing Mentorship is a consultation and support community, not a flight training organization, and does not provide legal flight instruction.
                            </span>
                        </label>
                    </div>

                    <div className="pt-8 text-center">
                        <button 
                            type="submit"
                            disabled={isSubmitting || !selectedRole || !agreedToTerms}
                            className={`px-12 py-5 rounded-full uppercase tracking-widest text-lg font-bold transition-all shadow-xl
                                      ${isSubmitting || !selectedRole || !agreedToTerms 
                                        ? 'bg-zinc-400 cursor-not-allowed' 
                                        : 'bg-red-700 text-white hover:bg-red-600'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center space-x-2">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>Processing...</span>
                                </span>
                            ) : (
                                "Complete Enrollment"
                            )}
                        </button>
                    </div>

                </form>
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </div>
  );
};