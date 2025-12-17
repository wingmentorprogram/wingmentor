
import React, { useState, useEffect } from 'react';
import { LoadingStage } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { Hub } from './components/Hub';
import { ProgramDetailPage } from './components/ProgramDetailPage';
import { EnrollmentPage } from './components/EnrollmentPage';
import { ShopPage } from './components/ShopPage'; 
import { LowTimerGapPage } from './components/LowTimerGapPage';
import { BlackBoxPage } from './components/BlackBoxPage'; 
import { LatestNewsPage } from './components/LatestNewsPage'; 
import { ImageEditorPage } from './components/ImageEditorPage'; // Import Editor
import { OperatingHandbookPage } from './components/OperatingHandbookPage'; // Import OperatingHandbookPage
import { WingMentorTeamPage } from './components/WingMentorTeamPage'; // NEW: Import WingMentorTeamPage
import { ExaminationTerminalPage } from './components/ExaminationTerminalPage'; // NEW: Import ExaminationTerminalPage
import { LoginPage } from './components/LoginPage'; // NEW: Import LoginPage
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { ThemeProvider } from './context/ThemeContext';

// Inner component to access config context for preloading
const AppContent: React.FC = () => {
  const [stage, setStage] = useState<LoadingStage>(LoadingStage.LOGO);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Used only for Hub navigation LOGIN option now
  const [isVideoWarm, setIsVideoWarm] = useState(false);
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const { config } = useConfig();

  useEffect(() => {
    // Stage 0: Logo Splash (3 seconds)
    if (stage === LoadingStage.LOGO) {
      const timer = setTimeout(() => {
        setStage(LoadingStage.LANDING);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleToggleLogin = () => {
    // Simplified: Navigation component handles the popup and validation. 
    // This just flips the state.
    setIsLoggedIn(!isLoggedIn);
  };

  // Handler for successful login from Hub Terminal
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); 
    setShowLoginModal(false);
    if (stage === LoadingStage.LOGIN) {
        setStage(LoadingStage.HUB);
    }
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    if (stage === LoadingStage.LOGIN) {
        setStage(LoadingStage.HUB);
    }
  };

  const goToLanding = () => {
    setStage(LoadingStage.LANDING);
  };

  const goToHub = () => {
    setStage(LoadingStage.HUB);
  };

  const goToProgramDetail = () => {
    setStage(LoadingStage.PROGRAM_DETAIL);
  };

  const goToEnrollment = () => {
    setStage(LoadingStage.ENROLLMENT);
  };

  const goToShop = () => { 
    setStage(LoadingStage.SHOP);
  };
  
  const goToGapPage = () => {
    setStage(LoadingStage.LOW_TIMER_GAP);
  };

  const goToBlackBox = () => { 
    setStage(LoadingStage.BLACK_BOX);
  };

  const goToLatestNews = () => { 
    setStage(LoadingStage.LATEST_NEWS);
  };

  const goToDeveloperEditor = () => { // New function
    setStage(LoadingStage.DEVELOPER_EDITOR);
  };

  const goToOperatingHandbook = () => { // Function to navigate to OperatingHandbookPage
    setStage(LoadingStage.OPERATING_HANDBOOK);
  };

  const goToTeamPage = () => { // NEW: Function to navigate to Team Page
    setStage(LoadingStage.TEAM_PAGE);
  };

  const goToExaminationTerminal = () => { // NEW: Function to navigate to Examination Terminal
    setStage(LoadingStage.EXAMINATION_TERMINAL);
  };

  const goToLandingAndScroll = (sectionId: string) => {
    setStage(LoadingStage.LANDING);
    setScrollToSection(sectionId);
  };

  const handleHubNavigation = (destination: string) => {
    if (destination === 'LANDING') {
      goToLanding();
    } else if (destination === 'PROGRAM') {
      goToProgramDetail();
    } else if (destination === 'EXAMINATION') {
      goToExaminationTerminal();
    } else if (destination === 'SHOP') {
      goToShop();
    } else if (destination === 'GAP') {
      goToGapPage();
    } else if (destination === 'BLACK_BOX') { 
      goToBlackBox();
    } else if (destination === 'LATEST_NEWS') { 
      goToLatestNews();
    } else if (destination === 'DEVELOPER') { 
      goToDeveloperEditor();
    } else if (destination === 'PASSPORT') {
      goToOperatingHandbook(); // Direct to handbook for passport info
    } else if (destination === 'LOGS') {
      goToOperatingHandbook(); // Direct to handbook for logs info
    } else if (destination === 'LOGIN') {
      setStage(LoadingStage.LOGIN); // Use stage for full page login from Hub
    } else {
      if (destination === 'TOOLS') {
         goToLanding();
      }
    }
  };

  const renderAppContent = () => (
    <>
      {(stage !== LoadingStage.LOGIN && stage !== LoadingStage.LOGO && stage !== LoadingStage.HUB && stage !== LoadingStage.DEVELOPER_EDITOR && stage !== LoadingStage.EXAMINATION_TERMINAL) && (
        <Navigation 
          isLoggedIn={isLoggedIn} 
          toggleLogin={handleToggleLogin} 
          onGoToLanding={goToLanding}
          onGoToHub={goToHub}
          onGoToProgramDetail={goToProgramDetail}
          onGoToShop={goToShop}
          onGoToGapPage={goToGapPage}
          onGoToBlackBox={goToBlackBox} 
          onGoToLatestNews={goToLatestNews} 
          onGoToLandingAndScroll={goToLandingAndScroll}
          onGoToOperatingHandbook={goToOperatingHandbook}
          onGoToTeamPage={goToTeamPage} 
          onGoToEnrollment={goToEnrollment} // NEW: Passed for the popup "Sign Up" button
        />
      )}

      {/* Render Login Modal (for Hub/Terminal access or manual trigger if needed, though Nav uses popup now) */}
      {stage === LoadingStage.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} onCancel={handleLoginCancel} />
      )}

      {stage === LoadingStage.LANDING && (
        <LandingPage 
          isVideoWarm={isVideoWarm} 
          setIsVideoWarm={setIsVideoWarm}
          onGoToProgramDetail={goToProgramDetail}
          onGoToGapPage={goToGapPage}
          onGoToOperatingHandbook={goToOperatingHandbook}
          onGoToBlackBox={goToBlackBox}
          onGoToExaminationTerminal={goToExaminationTerminal}
          scrollToSection={scrollToSection}
          onScrollComplete={() => setScrollToSection(null)}
        />
      )}
      {stage === LoadingStage.HUB && (
        <Hub onNavigate={handleHubNavigation} />
      )}
      {stage === LoadingStage.PROGRAM_DETAIL && (
        <ProgramDetailPage 
          onBackToLanding={goToLanding}
          onGoToEnrollment={goToEnrollment}
        />
      )}
      {stage === LoadingStage.ENROLLMENT && (
        <EnrollmentPage
          onBackToProgramDetail={goToProgramDetail}
          isLoggedIn={isLoggedIn}
          onLogin={handleToggleLogin}
        />
      )}
      {stage === LoadingStage.SHOP && (
        <ShopPage onBackToHub={goToHub} />
      )}
      {stage === LoadingStage.LOW_TIMER_GAP && (
        <LowTimerGapPage
          onBackToLanding={goToLanding}
          onGoToProgram={goToProgramDetail}
          isLoggedIn={isLoggedIn}
        />
      )}
      {stage === LoadingStage.BLACK_BOX && ( 
        <BlackBoxPage 
          onBackToLanding={goToLanding}
          isLoggedIn={isLoggedIn} 
          onLogin={handleToggleLogin} 
        />
      )}
      {stage === LoadingStage.LATEST_NEWS && ( 
        <LatestNewsPage
          onBackToLanding={goToLanding}
        />
      )}
      {stage === LoadingStage.DEVELOPER_EDITOR && ( // Render Editor
        <ImageEditorPage
          onBackToHub={goToHub}
        />
      )}
      {stage === LoadingStage.OPERATING_HANDBOOK && ( // Render OperatingHandbookPage
        <OperatingHandbookPage
          onBackToLanding={goToLanding}
          onGoToEnrollment={goToEnrollment}
          onGoToDeveloper={goToDeveloperEditor}
        />
      )}
      {stage === LoadingStage.TEAM_PAGE && ( // NEW: Render Team Page
        <WingMentorTeamPage
          onBackToLanding={goToLanding}
        />
      )}
      {stage === LoadingStage.EXAMINATION_TERMINAL && ( // NEW: Render Examination Terminal Page
        <ExaminationTerminalPage
          onNavigate={(destination) => {
            if (destination === 'PROGRAM') {
              goToProgramDetail();
            } else if (destination === 'HUB') {
              goToHub();
            }
          }}
          onBackToHub={goToHub}
        />
      )}
    </>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden font-['Raleway'] transition-colors duration-300
                    dark:bg-black dark:text-white
                    light:bg-white light:text-black">
      
      <div className="hidden">
        <video 
            src={config.heroVideoUrl} 
            preload="auto" 
            muted 
            playsInline
            width="0" 
            height="0"
        />
      </div>

      {stage === LoadingStage.LOGO && (
        <LoadingScreen />
      )}

      {(stage === LoadingStage.HUB || stage === LoadingStage.LANDING || stage === LoadingStage.PROGRAM_DETAIL || stage === LoadingStage.ENROLLMENT || stage === LoadingStage.SHOP || stage === LoadingStage.LOW_TIMER_GAP || stage === LoadingStage.BLACK_BOX || stage === LoadingStage.LATEST_NEWS || stage === LoadingStage.DEVELOPER_EDITOR || stage === LoadingStage.OPERATING_HANDBOOK || stage === LoadingStage.TEAM_PAGE || stage === LoadingStage.EXAMINATION_TERMINAL || stage === LoadingStage.LOGIN) && ( 
        renderAppContent()
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
